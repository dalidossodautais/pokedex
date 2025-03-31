export interface Pokemon {
  id: number;
  name: string;
  description: string;
  types: { name: string; code: string }[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  sprites: {
    front_default: string;
    back_default: string;
  };
}
