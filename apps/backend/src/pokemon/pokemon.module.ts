import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";

@Module({
  imports: [CacheModule.register({ ttl: 10 * 60 * 1_000 })],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
