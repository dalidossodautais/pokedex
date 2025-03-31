import { Injectable, Inject } from "@nestjs/common";
import axios from "axios";
import {
  PokemonBody,
  PokemonSpeciesBody,
  PokemonStatBody,
  PokemonTypeBody,
} from "./pokemon.interface";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Pokemon } from "@monorepo/types";

const defaultLang = "en";

@Injectable()
export class PokemonService {
  private readonly pokeApiUrl = "https://pokeapi.co/api/v2";

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private async getTypeTranslation(
    typeName: string,
    lang: string,
  ): Promise<string> {
    try {
      const cacheKey = `type:${typeName}:${lang}`;
      let translation = await this.cacheManager.get<string>(cacheKey);

      if (!translation) {
        const { data: typeData } = await axios.get<PokemonTypeBody>(
          `${this.pokeApiUrl}/type/${typeName}`,
        );

        const localizedName = typeData.names.find(
          (name) => name.language.name === lang,
        )?.name;

        translation = localizedName || typeName;

        await this.cacheManager.set(cacheKey, translation);
      }

      return translation;
    } catch (error) {
      console.error(
        `Failed to fetch type translation for ${typeName} in ${lang}:`,
        error,
      );
      return typeName;
    }
  }

  private async getStatTranslation(
    statName: string,
    lang: string,
  ): Promise<string> {
    try {
      const cacheKey = `stat:${statName}:${lang}`;
      let translation = await this.cacheManager.get<string>(cacheKey);

      if (!translation) {
        const { data: statData } = await axios.get<PokemonStatBody>(
          `${this.pokeApiUrl}/stat/${statName}`,
        );

        const localizedName = statData.names.find(
          (name) => name.language.name === lang,
        )?.name;

        translation = localizedName || statName;

        await this.cacheManager.set(cacheKey, translation);
      }

      return translation;
    } catch (error) {
      console.error(
        `Failed to fetch stat translation for ${statName} in ${lang}:`,
        error,
      );
      return statName;
    }
  }

  private getBasePokemon = async (id: string): Promise<Pokemon | null> => {
    const cacheKey = `base-pokemon:${id}`;
    const cachedPokemon = await this.cacheManager.get<Pokemon>(cacheKey);

    if (cachedPokemon) {
      return cachedPokemon;
    }

    const { data: pokemon } = await axios.get<PokemonBody>(
      `${this.pokeApiUrl}/pokemon/${id}`,
    );

    const formattedPokemon: Pokemon = {
      id: pokemon.id,
      name: pokemon.name,
      description: pokemon.description,
      types: pokemon.types.map((type) => ({
        name: type.type.name,
        code: type.type.name,
      })),
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      sprites: {
        front_default: pokemon.sprites.front_default,
        back_default: pokemon.sprites.back_default,
      },
    };

    await this.cacheManager.set(cacheKey, formattedPokemon);

    return formattedPokemon;
  };

  public getPokemon = async (
    id: string,
    lang: string = defaultLang,
  ): Promise<Pokemon | null> => {
    const cacheKey = `pokemon:${id}:${lang}`;
    const cachedPokemon = await this.cacheManager.get<Pokemon>(cacheKey);

    if (cachedPokemon) {
      return cachedPokemon;
    }

    const basePokemon = await this.getBasePokemon(id);

    try {
      const speciesResponse = await axios.get<PokemonSpeciesBody>(
        `${this.pokeApiUrl}/pokemon-species/${id}`,
      );

      basePokemon.name =
        speciesResponse.data.names.find((name) => name.language.name === lang)
          ?.name ?? basePokemon.name;

      basePokemon.description =
        speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === lang,
        )?.flavor_text ?? basePokemon.description;
    } catch (error) {
      console.error(
        `Failed to fetch localized data for pokemon ${id} in ${lang}:`,
        error,
      );
    }

    basePokemon.types = await Promise.all(
      basePokemon.types.map(async (type) => ({
        name: await this.getTypeTranslation(type.code, lang),
        code: type.code,
      })),
    );

    basePokemon.stats = await Promise.all(
      basePokemon.stats.map(async (stat) => ({
        name: await this.getStatTranslation(stat.name, lang),
        value: stat.value,
      })),
    );

    await this.cacheManager.set(cacheKey, basePokemon);

    return basePokemon;
  };
}
