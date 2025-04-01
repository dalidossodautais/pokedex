import styled from "styled-components";

export const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: all 0.3s ease;
  text-transform: uppercase;

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
