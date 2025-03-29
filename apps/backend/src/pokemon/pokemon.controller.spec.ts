import { Test, TestingModule } from "@nestjs/testing";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";
import { HttpException } from "@nestjs/common";

describe("PokemonController", () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemonService = {
    getPokemon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: mockPokemonService,
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
    it("should return pokemon data when given a valid ID", async () => {
      const mockPokemon = {
        id: 25,
        name: "pikachu",
        types: ["electric"],
        height: 4,
        weight: 60,
        stats: [
          { name: "hp", value: 35 },
          { name: "attack", value: 55 },
        ],
        sprites: {
          front_default: "https://example.com/pikachu.png",
          back_default: "https://example.com/pikachu-back.png",
        },
      };

      mockPokemonService.getPokemon.mockResolvedValueOnce(mockPokemon);

      const result = await controller.getPokemon("25");

      expect(result).toEqual(mockPokemon);
      expect(service.getPokemon).toHaveBeenCalledWith("25");
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
