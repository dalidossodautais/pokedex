import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { AxiosError } from "axios";

@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

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
