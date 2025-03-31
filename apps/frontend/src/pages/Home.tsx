import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";
import PokemonLink from "../components/PokemonLink";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
`;

const Card = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 700px;
  text-align: center;
  transform: translateY(-5%);
  position: relative;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.8;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 10, 45, 0.2);
    transform: translateY(-2px);
  }
`;

const SearchButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: all 0.3s ease;
  height: 60px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover:not(:disabled) {
    background-color: #b00823;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(220, 10, 45, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PokemonIcons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// IDs des Pokémon populaires à afficher
const FEATURED_POKEMON_IDS = ["1", "4", "7", "25"];

const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: 100;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  // Check if search term is valid
  const isInvalidSearch = useMemo(() => {
    return searchTerm.trim() === "";
  }, [searchTerm]);

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInvalidSearch) {
      void navigate(`/pokemon/${searchTerm.trim().toLowerCase()}`);
    }
  };

  return (
    <Container>
      <LanguageSelectorContainer>
        <LanguageSelector />
      </LanguageSelectorContainer>

      <Card>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
        <SearchForm onSubmit={handleSubmit}>
          <SearchBar
            autoFocus
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <SearchButton disabled={isInvalidSearch} type="submit">
            {t("searchButton")}
          </SearchButton>
        </SearchForm>

        <PokemonIcons>
          {FEATURED_POKEMON_IDS.map((id) => (
            <PokemonLink key={id} id={id} />
          ))}
        </PokemonIcons>
      </Card>
    </Container>
  );
};

export default Home;
