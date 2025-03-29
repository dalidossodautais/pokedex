import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { AxiosError } from "axios";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseInterceptors(CacheInterceptor)
  @Get(":id")
  async getPokemon(@Param("id") id: string) {
    if (isNaN(Number(id))) {
      throw new HttpException("Invalid Pokemon ID", HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.pokemonService.getPokemon(id);
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
