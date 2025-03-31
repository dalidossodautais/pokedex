import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useGetPokemonByIdQuery } from "../store/services/pokemon";
import PokemonStat from "../components/PokemonStat";
import LanguageSelector from "../components/LanguageSelector";

// Utilitaires
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Composants stylisés
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 800px;
  min-width: 300px;
  position: relative;

  @media (max-width: 400px) {
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
  }
`;

const BackButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: bold;
  transition: all 0.3s ease;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  align-self: flex-start;

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

const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: 100;
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
    // Assurons-nous que le type existe dans notre thème, sinon on utilise normal
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

// Fonction utilitaire pour nettoyer la description
const cleanDescription = (description: string): string => {
  if (!description) return "";

  // Simplement remplacer tous les caractères spéciaux par des espaces
  return description
    .replace(/[◀►]/g, " ") // Remplacer les flèches par des espaces
    .replace(/\s+/g, " ") // Normaliser les espaces multiples en un seul espace
    .trim(); // Enlever les espaces en début et fin
};

const PokemonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Requête avec la langue actuelle de i18n
  const {
    data: pokemon,
    error,
    isLoading,
  } = useGetPokemonByIdQuery({
    id: id || "",
    lang: i18n.language as "fr" | "en" | "es" | "it" | "de",
  });

  // Revenir à la page d'accueil
  const handleBack = () => {
    void navigate(-1);
  };

  // Définir le titre de la page
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

  // Type principal pour les couleurs
  const mainType = pokemon?.types[0]?.code || "normal";

  if (isLoading) {
    return (
      <Container>
        <LanguageSelectorContainer>
          <LanguageSelector />
        </LanguageSelectorContainer>

        <BackButton onClick={handleBack}>{t("backButton")}</BackButton>
        <Card>
          <Header>
            <PokemonName>{t("loading")}</PokemonName>
          </Header>
          <LoadingContainer>
            <LoadingText>{t("loadingPokemon")}</LoadingText>
          </LoadingContainer>
        </Card>
      </Container>
    );
  }

  if (error || !pokemon) {
    return (
      <Container>
        <LanguageSelectorContainer>
          <LanguageSelector />
        </LanguageSelectorContainer>

        <BackButton onClick={handleBack}>{t("backButton")}</BackButton>
        <Card>
          <ErrorContainer>
            <ErrorMessage>
              {error ? t("errorTitle") : t("errorNotFound")}
            </ErrorMessage>
          </ErrorContainer>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <LanguageSelectorContainer>
        <LanguageSelector />
      </LanguageSelectorContainer>

      <BackButton onClick={handleBack}>{t("backButton")}</BackButton>
      <Card>
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
      </Card>
    </Container>
  );
};

export default PokemonPage;
