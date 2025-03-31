import React from "react";
import styled from "styled-components";

interface PokemonStatProps {
  statName: string;
  value: number;
  mainType: string;
}

const StatRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatName = styled.span`
  width: 150px;
  min-width: 150px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatValueContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatValue = styled.span`
  width: 40px;
  text-align: right;
  font-weight: bold;
`;

const StatBar = styled.div<{ $value: number; $type: string }>`
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ $value }) => Math.min(($value / 255) * 100, 100)}%;
    background-color: ${({ theme, $type }) =>
      theme.colors.typeColors[$type as keyof typeof theme.colors.typeColors] ||
      theme.colors.typeColors.normal};
    border-radius: 4px;
  }
`;

const PokemonStat: React.FC<PokemonStatProps> = ({
  statName,
  value,
  mainType,
}) => {
  return (
    <StatRow>
      <StatName>{statName}</StatName>
      <StatValueContainer>
        <StatValue>{value}</StatValue>
        <StatBar $value={value} $type={mainType} />
      </StatValueContainer>
    </StatRow>
  );
};

export default PokemonStat;
