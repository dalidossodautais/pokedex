export interface PokemonBody {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities?: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  sprites: { front_default: string; back_default: string };
}
