import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";
import { ReactNode } from "react";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: 100;
`;

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <LanguageSelectorContainer>
        <LanguageSelector />
      </LanguageSelectorContainer>
      {children}
    </Container>
  );
};

export default Layout;
