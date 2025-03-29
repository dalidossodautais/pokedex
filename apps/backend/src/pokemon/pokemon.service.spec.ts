import { Test, TestingModule } from "@nestjs/testing";
import { PokemonService } from "./pokemon.service";
import axios from "axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

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

    const formattedPokemon = {
      id: 25,
      name: "pikachu",
      types: ["electric"],
      height: 4,
      weight: 60,
      stats: {
        hp: 35,
        attack: 55,
        defense: 40,
        specialAttack: 50,
        specialDefense: 40,
        speed: 90,
      },
      sprites: {
        front_default: "https://example.com/pikachu.png",
        back_default: "https://example.com/pikachu-back.png",
      },
    };

    it("should return pokemon data from API when not in cache", async () => {
      cacheMock.get.mockResolvedValueOnce(null);
      getSpy.mockResolvedValueOnce({ data: mockPokemonData });

      const result = await service.getPokemon("25");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:25");
      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/25",
      );
      expect(cacheMock.set).toHaveBeenCalledWith(
        "pokemon:25",
        formattedPokemon,
      );
      expect(result).toEqual(formattedPokemon);
    });

    it("should verify cache parameters when storing pokemon data", async () => {
      cacheMock.get.mockResolvedValueOnce(null);
      getSpy.mockResolvedValueOnce({ data: mockPokemonData });

      await service.getPokemon("25");

      expect(cacheMock.set).toHaveBeenCalledWith(
        "pokemon:25",
        formattedPokemon,
      );

      expect(cacheMock.set).toHaveBeenCalledTimes(1);
    });

    it("should return pokemon data from cache when available", async () => {
      cacheMock.get.mockResolvedValueOnce(formattedPokemon);

      const result = await service.getPokemon("25");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:25");
      expect(getSpy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(result).toEqual(formattedPokemon);
    });

    it("should handle API errors properly", async () => {
      cacheMock.get.mockResolvedValueOnce(null);
      getSpy.mockRejectedValueOnce(new Error("API Error"));

      await expect(service.getPokemon("999")).rejects.toThrow("API Error");

      expect(cacheMock.get).toHaveBeenCalledWith("pokemon:999");
      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/999",
      );
      expect(cacheMock.set).not.toHaveBeenCalled();
    });
  });
});
