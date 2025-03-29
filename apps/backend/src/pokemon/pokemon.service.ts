import { Pokemon } from "@monorepo/types";
import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { PokemonBody } from "./pokemon.interface";

const getBaseStat = (
  name: string,
  stats: { stat: { name: string }; base_stat: number }[],
) => {
  return stats.find((stat) => stat.stat.name === name)?.base_stat;
};

@Injectable()
export class PokemonService {
  private readonly pokeApiUrl = "https://pokeapi.co/api/v2";

  public getPokemon = async (id: string): Promise<Pokemon | null> => {
    const response: AxiosResponse<PokemonBody> = await axios.get(
      `${this.pokeApiUrl}/pokemon/${id}`,
    );

    const pokemon = response.data;

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((type) => type.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      stats: {
        hp: getBaseStat("hp", pokemon.stats),
        attack: getBaseStat("attack", pokemon.stats),
        defense: getBaseStat("defense", pokemon.stats),
        specialAttack: getBaseStat("special-attack", pokemon.stats),
        specialDefense: getBaseStat("special-defense", pokemon.stats),
        speed: getBaseStat("speed", pokemon.stats),
      },
      sprites: {
        front_default: pokemon.sprites.front_default,
        back_default: pokemon.sprites.back_default,
      },
    };
  };
}
