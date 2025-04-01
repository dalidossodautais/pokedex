import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";

export const Container = styled.div`
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

const Layout = ({ children }: { children: React.ReactNode }) => {
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
