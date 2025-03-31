export const mockPokemonApiResponse = {
  id: 25,
  height: 4,
  weight: 60,
  sprites: {
    front_default: "https://example.com/pikachu.png",
    back_default: "https://example.com/pikachu-back.png",
  },
  name: "pikachu",
  types: [{ type: { name: "electric" } }],
  stats: [
    { stat: { name: "hp" }, base_stat: 35 },
    { stat: { name: "attack" }, base_stat: 55 },
    { stat: { name: "defense" }, base_stat: 40 },
    { stat: { name: "special-attack" }, base_stat: 50 },
    { stat: { name: "special-defense" }, base_stat: 40 },
    { stat: { name: "speed" }, base_stat: 90 },
  ],
};

export const mockBasePokemon = {
  id: 25,
  height: 4,
  weight: 60,
  sprites: {
    front_default: "https://example.com/pikachu.png",
    back_default: "https://example.com/pikachu-back.png",
  },
  name: "Pikachu",
  types: [{ name: "Electric", code: "electric" }],
  stats: [
    { name: "HP", value: 35 },
    { name: "Attack", value: 55 },
    { name: "Defense", value: 40 },
    { name: "Special Attack", value: 50 },
    { name: "Special Defense", value: 40 },
    { name: "Speed", value: 90 },
  ],
};

export const mockPokemonEn = {
  ...mockBasePokemon,
  description: "Electric mouse",
};

export const mockPokemonFr = {
  ...mockBasePokemon,
  name: "Pikachu",
  types: [{ name: "Électrik", code: "electric" }],
  stats: [
    { name: "PV", value: 35 },
    { name: "Attaque", value: 55 },
    { name: "Défense", value: 40 },
    { name: "Attaque Spéciale", value: 50 },
    { name: "Défense Spéciale", value: 40 },
    { name: "Vitesse", value: 90 },
  ],
};

export const mockSpeciesData = {
  names: [
    { name: "Pikachu", language: { name: "en" } },
    { name: "Pikachu", language: { name: "fr" } },
    { name: "Pikachu", language: { name: "es" } },
  ],
  flavor_text_entries: [
    { flavor_text: "Electric mouse", language: { name: "en" } },
    { flavor_text: "Souris électrique", language: { name: "fr" } },
    { flavor_text: "Ratón eléctrico", language: { name: "es" } },
  ],
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
};

export const mockTypeData = {
  names: [
    { name: "Electric", language: { name: "en" } },
    { name: "Électrik", language: { name: "fr" } },
    { name: "Eléctrico", language: { name: "es" } },
  ],
};

export const mockStatData = {
  names: [
    { name: "HP", language: { name: "en" } },
    { name: "Attack", language: { name: "en" } },
    { name: "Defense", language: { name: "en" } },
    { name: "Special Attack", language: { name: "en" } },
    { name: "Special Defense", language: { name: "en" } },
    { name: "Speed", language: { name: "en" } },
  ],
};
