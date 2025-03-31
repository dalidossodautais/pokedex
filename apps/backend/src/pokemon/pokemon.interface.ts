export interface PokemonBody {
  id: number;
  name: string;
  description: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities?: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  sprites: { front_default: string; back_default: string };
}

export interface PokemonSpeciesBody {
  names: {
    name: string;
    language: { name: string };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  evolution_chain: { url: string };
}

export interface PokemonTypeBody {
  names: {
    name: string;
    language: { name: string };
  }[];
}

export interface PokemonStatBody {
  names: {
    name: string;
    language: { name: string };
  }[];
}
