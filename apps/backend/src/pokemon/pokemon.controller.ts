import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { AxiosError } from "axios";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Pokemon } from "@monorepo/types";

@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseInterceptors(CacheInterceptor)
  @Get(":id")
  async getPokemon(
    @Param("id") id: string,
    @Query("lang") lang: string = "en",
  ): Promise<Pokemon | null> {
    if (isNaN(Number(id))) {
      throw new HttpException("Invalid Pokemon ID", HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.pokemonService.getPokemon(id, lang);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
