import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import PokemonLink from "../components/PokemonLink";
import { Button, Card, Input } from "@pokedex/ui";
import Layout from "../components/Layout";

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

const PokemonIcons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SearchButton = styled(Button)`
  letter-spacing: 1px;
`;

const FEATURED_POKEMON_IDS = ["1", "4", "7", "25"];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const isInvalidSearch = useMemo(() => {
    return searchTerm.trim() === "";
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInvalidSearch) {
      void navigate(`/pokemon/${searchTerm.trim().toLowerCase()}`);
    }
  };

  return (
    <Layout>
      <Card>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
        <SearchForm onSubmit={handleSubmit}>
          <Input
            width="100%"
            autoFocus
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
    </Layout>
  );
};

export default Home;
