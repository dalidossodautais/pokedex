import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";
import { POKEMON_CACHE_TTL } from "./pokemon.constants";

@Module({
  imports: [CacheModule.register({ ttl: POKEMON_CACHE_TTL })],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
