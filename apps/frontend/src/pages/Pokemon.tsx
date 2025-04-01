import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useGetPokemonByIdQuery } from "../store/services/pokemon";
import PokemonStat from "../components/PokemonStat";
import { Button, Card } from "@pokedex/ui";
import Layout from "../components/Layout";

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

const BackButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PokemonName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: capitalize;
`;

const PokemonId = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TypesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, $type }) => {
    return (
      theme.colors.typeColors[$type as keyof typeof theme.colors.typeColors] ||
      theme.colors.typeColors.normal
    );
  }};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  text-transform: capitalize;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  aspect-ratio: 1;
`;

const PokemonImage = styled.img`
  width: 100%;
  max-width: 250px;
  height: auto;
  object-fit: contain;
`;

const StatsContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  margin: 0 auto;
  max-width: 600px;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DescriptionContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const DescriptionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  text-align: justify;
  margin: 0;
  padding: 0;
`;

const cleanDescription = (description: string): string => {
  if (!description) return "";

  return description.replace(/[◀►]/g, " ").replace(/\s+/g, " ").trim();
};

const PokemonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const {
    data: pokemon,
    error,
    isLoading,
  } = useGetPokemonByIdQuery({
    id: id || "",
    lang: i18n.language as "fr" | "en" | "es" | "it" | "de",
  });

  const handleBack = () => {
    void navigate(-1);
  };

  useEffect(() => {
    if (pokemon) {
      document.title = `Pokédex - ${capitalize(pokemon.name)}`;
    } else {
      document.title = "Pokédex";
    }

    return () => {
      document.title = "Pokédex";
    };
  }, [pokemon]);

  const mainType = pokemon?.types[0]?.code || "normal";

  let content = null;

  if (isLoading) {
    content = (
      <>
        <Header>
          <PokemonName>{t("loading")}</PokemonName>
        </Header>
        <LoadingContainer>
          <LoadingText>{t("loadingPokemon")}</LoadingText>
        </LoadingContainer>
      </>
    );
  } else if (error || !pokemon) {
    content = (
      <>
        <ErrorContainer>
          <ErrorMessage>
            {error ? t("errorTitle") : t("errorNotFound")}
          </ErrorMessage>
        </ErrorContainer>
      </>
    );
  } else {
    content = (
      <>
        <Header>
          <PokemonName>{pokemon.name}</PokemonName>
          <PokemonId>{formatId(pokemon.id)}</PokemonId>
          <TypesContainer>
            {pokemon.types.map((type) => (
              <TypeBadge key={type.name} $type={type.code}>
                {type.name}
              </TypeBadge>
            ))}
          </TypesContainer>
        </Header>

        <Content>
          <ImageContainer>
            <PokemonImage
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
          </ImageContainer>

          <StatsContainer>
            <SectionTitle>{t("statistics")}</SectionTitle>
            {pokemon.stats.map((stat) => (
              <PokemonStat
                key={stat.name}
                statName={stat.name}
                value={stat.value}
                mainType={mainType}
              />
            ))}
          </StatsContainer>
        </Content>

        {pokemon.description && (
          <DescriptionContainer>
            <DescriptionText>
              {cleanDescription(pokemon.description)}
            </DescriptionText>
          </DescriptionContainer>
        )}

        <InfoGrid>
          <InfoCard>
            <InfoLabel>{t("height")}</InfoLabel>
            <InfoValue>{pokemon.height / 10} m</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>{t("weight")}</InfoLabel>
            <InfoValue>{pokemon.weight / 10} kg</InfoValue>
          </InfoCard>
        </InfoGrid>
      </>
    );
  }

  return (
    <Layout>
      <Card>
        <BackButton onClick={handleBack}>{t("backButton")}</BackButton>
        {content}
      </Card>
    </Layout>
  );
};

export default PokemonPage;
