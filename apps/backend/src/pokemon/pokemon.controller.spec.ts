import { Test, TestingModule } from "@nestjs/testing";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";
import { HttpException } from "@nestjs/common";
import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";

describe("PokemonController", () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemonService = {
    getPokemon: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: mockPokemonService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getPokemon", () => {
    it("should return pokemon data when given a valid ID with default language", async () => {
      const mockPokemon = {
        id: 25,
        name: "pikachu",
        types: [{ name: "electric", code: "electric" }],
        height: 4,
        weight: 60,
        stats: [
          { name: "hp", value: 35 },
          { name: "attack", value: 55 },
          { name: "defense", value: 40 },
          { name: "specialAttack", value: 50 },
          { name: "specialDefense", value: 40 },
          { name: "speed", value: 90 },
        ],
        sprites: {
          front_default: "https://example.com/pikachu.png",
          back_default: "https://example.com/pikachu-back.png",
        },
      };

      mockPokemonService.getPokemon.mockResolvedValueOnce(mockPokemon);

      const result = await controller.getPokemon("25");

      expect(result).toEqual(mockPokemon);
      expect(service.getPokemon).toHaveBeenCalledWith("25", "en");
    });

    it("should return pokemon data with specified language", async () => {
      const mockPokemon = {
        id: 25,
        name: "Pikachu",
        types: [{ name: "Électrik", code: "electric" }],
        height: 4,
        weight: 60,
        stats: [
          { name: "PV", value: 35 },
          { name: "Attaque", value: 55 },
          { name: "Défense", value: 40 },
          { name: "Attaque Spéciale", value: 50 },
          { name: "Défense Spéciale", value: 40 },
          { name: "Vitesse", value: 90 },
        ],
        sprites: {
          front_default: "https://example.com/pikachu.png",
          back_default: "https://example.com/pikachu-back.png",
        },
      };

      mockPokemonService.getPokemon.mockResolvedValueOnce(mockPokemon);

      const result = await controller.getPokemon("25", "fr");

      expect(result).toEqual(mockPokemon);
      expect(service.getPokemon).toHaveBeenCalledWith("25", "fr");
    });

    it("should throw HttpException when given an invalid ID", async () => {
      await expect(controller.getPokemon("invalid")).rejects.toThrow(
        HttpException,
      );
    });

    it("should throw HttpException when pokemon is not found", async () => {
      mockPokemonService.getPokemon.mockRejectedValueOnce(
        new Error("Not found"),
      );

      await expect(controller.getPokemon("9999")).rejects.toThrow(
        HttpException,
      );
    });
  });
});
