import styled from "styled-components";

export const CardBox = styled.div<{ $variant?: "primary" | "secondary" }>`
  background-color: ${({ theme, $variant = "primary" }) =>
    $variant === "primary" ? "white" : theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  width: 100%;
  ${({ theme, $variant = "primary" }) =>
    $variant === "primary" &&
    `
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid ${theme.colors.secondary};
    `}
`;
