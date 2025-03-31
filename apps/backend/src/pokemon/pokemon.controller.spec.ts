import { Test, TestingModule } from "@nestjs/testing";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";
import { HttpException } from "@nestjs/common";
import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import { mockPokemonEn, mockPokemonFr } from "./pokemon.mock";

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
    jest.clearAllMocks();
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
      mockPokemonService.getPokemon.mockResolvedValueOnce(mockPokemonEn);

      const result = await controller.getPokemon("25");

      expect(result).toEqual(mockPokemonEn);
      expect(service.getPokemon).toHaveBeenCalledWith("25", "en");
    });

    it("should return pokemon data with specified language", async () => {
      mockPokemonService.getPokemon.mockResolvedValueOnce(mockPokemonFr);

      const result = await controller.getPokemon("25", "fr");

      expect(result).toEqual(mockPokemonFr);
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
