import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export interface GetPokemonParams {
  id: string;
  lang?: string;
}

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    getPokemonById: build.query<Pokemon, string | GetPokemonParams>({
      query: (params) => {
        if (typeof params === "string") {
          return `pokemon/${params}`;
        }
        const { id, lang } = params;
        return `pokemon/${id}${lang && lang !== "en" ? `?lang=${lang}` : ""}`;
      },
    }),
  }),
});

export const { useGetPokemonByIdQuery } = pokemonApi;
