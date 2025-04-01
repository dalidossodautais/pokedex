import { useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useGetPokemonByIdQuery } from "@/store/services/pokemon";

interface PokemonLinkProps {
  id: string;
  onSelect?: (id: string) => void;
}

const PokemonButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing.xs};
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  img {
    width: 60px;
    height: 60px;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.text};
    text-transform: capitalize;
  }

  &:hover:not(:disabled) {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:focus-visible:not(:disabled) {
    transform: scale(1.1);
    background-color: rgba(220, 10, 45, 0.1);
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Loader = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.text};
`;

const PokemonLink = ({ id, onSelect }: PokemonLinkProps) => {
  const navigate = useNavigate();
  const { data: pokemon, isLoading } = useGetPokemonByIdQuery(id);

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(id);
    } else {
      void navigate(`/pokemon/${id}`);
    }
  }, [id, navigate, onSelect]);

  return (
    <PokemonButton
      onClick={handleClick}
      aria-label={
        pokemon
          ? `Sélectionner ${pokemon.name} (Pokémon n°${id})`
          : `Sélectionner le Pokémon n°${id}`
      }
    >
      {isLoading ? (
        <Loader>#{id}</Loader>
      ) : pokemon ? (
        <>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            title={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          />
        </>
      ) : (
        <Loader>#{id}</Loader>
      )}
    </PokemonButton>
  );
};

export default PokemonLink;
