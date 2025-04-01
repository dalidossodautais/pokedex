import styled from "styled-components";

export const Card = styled.div`
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
