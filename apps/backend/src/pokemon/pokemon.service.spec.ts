import { Test, TestingModule } from "@nestjs/testing";
import { PokemonService } from "./pokemon.service";
import axios from "axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { mockBasePokemon, mockPokemonFr } from "./pokemon.mock";

describe("PokemonService", () => {
  let service: PokemonService;
  let getSpy: jest.SpyInstance;
  let cacheMock: {
    get: jest.Mock;
    set: jest.Mock;
  };

  beforeEach(async () => {
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    getSpy = jest.spyOn(axios, "get");
  });

  afterEach(() => {
    getSpy.mockReset();
    cacheMock.get.mockReset();
    cacheMock.set.mockReset();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getPokemon", () => {
    const mockPokemonData = {
      id: 25,
      name: "pikachu",
      types: [{ type: { name: "electric" } }],
      height: 4,
      weight: 60,
      stats: [
        { stat: { name: "hp" }, base_stat: 35 },
        { stat: { name: "attack" }, base_stat: 55 },
        { stat: { name: "defense" }, base_stat: 40 },
        { stat: { name: "special-attack" }, base_stat: 50 },
        { stat: { name: "special-defense" }, base_stat: 40 },
        { stat: { name: "speed" }, base_stat: 90 },
      ],
      sprites: {
        front_default: "https://example.com/pikachu.png",
        back_default: "https://example.com/pikachu-back.png",
      },
    };

    const mockSpeciesData = {
      names: [
        { name: "Pikachu", language: { name: "en" } },
        { name: "Pikachu", language: { name: "fr" } },
        { name: "Pikachu", language: { name: "es" } },
      ],
      flavor_text_entries: [
        { flavor_text: "Electric mouse", language: { name: "en" } },
        { flavor_text: "Souris électrique", language: { name: "fr" } },
        { flavor_text: "Ratón eléctrico", language: { name: "es" } },
      ],
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
    };

    const mockTypeData = {
      names: [
        { name: "Electric", language: { name: "en" } },
        { name: "Électrik", language: { name: "fr" } },
        { name: "Eléctrico", language: { name: "es" } },
      ],
    };

    const mockStatData = {
      names: [
        { name: "HP", language: { name: "en" } },
        { name: "PV", language: { name: "fr" } },
        { name: "PS", language: { name: "es" } },
      ],
    };

    it("should return pokemon data in English by default from API when not in cache", async () => {
      // Mock base Pokemon cache miss but species/type/stat data hits
      cacheMock.get.mockImplementation((key: string) => {
        if (key === "base-pokemon:25") return null;
        if (key === "pokemon:25:en") return null;
        if (key.startsWith("type:")) return "Electric";
        if (key.startsWith("stat:")) return "HP";
        return null;
      });

      getSpy.mockImplementation((url: string) => {
        if (url.includes("/pokemon/25")) return { data: mockPokemonData };
        if (url.includes("/pokemon-species/25"))
          return { data: mockSpeciesData };
        if (url.includes("/type/")) return { data: mockTypeData };
        if (url.includes("/stat/")) return { data: mockStatData };
        return { data: {} };
      });

      const result = await service.getPokemon("25");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:25:en");
      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/25",
      );
      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon-species/25",
      );
      expect(cacheMock.set).toHaveBeenCalledWith(
        "pokemon:25:en",
        expect.objectContaining({ name: "Pikachu" }),
      );
      expect(result.name).toEqual("Pikachu");
      expect(result.description).toEqual("Electric mouse");
    });

    it("should return pokemon data in French when language parameter is provided", async () => {
      cacheMock.get.mockImplementation((key: string) => {
        if (key === "base-pokemon:25") return mockBasePokemon;
        if (key === "pokemon:25:fr") return null;
        if (key === "type:electric:fr") return null;
        if (key === "stat:hp:fr") return null;
        return null;
      });

      getSpy.mockImplementation((url: string) => {
        if (url.includes("/pokemon-species/25"))
          return { data: mockSpeciesData };
        if (url.includes("/type/")) return { data: mockTypeData };
        if (url.includes("/stat/")) return { data: mockStatData };
        return { data: {} };
      });

      const result = await service.getPokemon("25", "fr");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:25:fr");
      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon-species/25",
      );
      expect(cacheMock.set).toHaveBeenCalledWith(
        "pokemon:25:fr",
        expect.objectContaining({ description: "Souris électrique" }),
      );
      expect(result.name).toEqual("Pikachu");
      expect(result.description).toEqual("Souris électrique");
      expect(result.types[0].name).toEqual("Électrik");
    });

    it("should return pokemon data from cache when available for the specified language", async () => {
      cacheMock.get.mockImplementation((key: string) => {
        if (key === "pokemon:25:fr") return mockPokemonFr;
        return null;
      });

      const result = await service.getPokemon("25", "fr");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:25:fr");
      expect(getSpy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(result).toEqual(mockPokemonFr);
    });

    it("should handle API errors properly while still using defaults", async () => {
      cacheMock.get.mockImplementation((key: string) => {
        if (key === "base-pokemon:25") return mockBasePokemon;
        if (key.startsWith("type:")) return "Electric";
        if (key.startsWith("stat:")) return "HP";
        return null;
      });

      getSpy.mockImplementation((url: string) => {
        if (url.includes("/pokemon-species/25")) {
          throw new Error("API Error");
        }
        return { data: {} };
      });

      const result = await service.getPokemon("25");

      expect(result.name).toEqual("Pikachu");
      expect(result.description).toEqual("Souris électrique");
    });
  });
});
