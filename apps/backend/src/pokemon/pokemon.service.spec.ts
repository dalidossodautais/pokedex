import { Test, TestingModule } from "@nestjs/testing";
import { PokemonService } from "./pokemon.service";
import axios from "axios";

describe("PokemonService", () => {
  let service: PokemonService;
  let getSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);

    getSpy = jest.spyOn(axios, "get");
  });

  afterEach(() => {
    getSpy.mockReset();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getPokemon", () => {
    it("should return pokemon data when given a valid ID", async () => {
      const mockPokemonData = {
        id: 25,
        name: "pikachu",
        types: [{ type: { name: "electric" } }],
        height: 4,
        weight: 60,
        stats: [
          { stat: { name: "hp" }, base_stat: 35 },
          { stat: { name: "attack" }, base_stat: 55 },
        ],
        sprites: {
          front_default: "https://example.com/pikachu.png",
          back_default: "https://example.com/pikachu-back.png",
        },
      };

      getSpy.mockResolvedValueOnce({ data: mockPokemonData });

      const result = await service.getPokemon("25");

      expect(result).toEqual({
        id: 25,
        name: "pikachu",
        types: ["electric"],
        height: 4,
        weight: 60,
        stats: { hp: 35, attack: 55 },
        sprites: {
          front_default: "https://example.com/pikachu.png",
          back_default: "https://example.com/pikachu-back.png",
        },
      });

      expect(getSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/25",
      );
    });

    it("should handle API errors", async () => {
      getSpy.mockRejectedValueOnce(new Error("API Error"));

      await expect(service.getPokemon("999")).rejects.toThrow("API Error");
    });
  });
});
