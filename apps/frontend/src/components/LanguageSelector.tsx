import { useState, useRef, useEffect, FC } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

type SupportedLanguage = "fr" | "en" | "es" | "it" | "de";

type Language = {
  code: SupportedLanguage;
  name: string;
  flagUrl: string;
};

const languages: Language[] = [
  {
    code: "fr",
    name: "Français",
    flagUrl: "https://flagcdn.com/w40/fr.png",
  },
  {
    code: "en",
    name: "English",
    flagUrl: "https://flagcdn.com/w40/gb.png",
  },
  {
    code: "es",
    name: "Español",
    flagUrl: "https://flagcdn.com/w40/es.png",
  },
  {
    code: "it",
    name: "Italiano",
    flagUrl: "https://flagcdn.com/w40/it.png",
  },
  {
    code: "de",
    name: "Deutsch",
    flagUrl: "https://flagcdn.com/w40/de.png",
  },
];

interface LanguageSelectorProps {
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

const SelectorContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const CurrentLanguage = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FlagImage = styled.img`
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const LanguageName = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 180px;
  max-height: ${({ $isOpen }) => ($isOpen ? "300px" : "0")};
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  transition:
    max-height 0.3s ease,
    opacity 0.2s ease;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const LanguageOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.secondary : "transparent"};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LanguageSelector: FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageClick = (langCode: SupportedLanguage) => {
    if (langCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    void i18n.changeLanguage(langCode);

    if (onLanguageChange) {
      onLanguageChange(langCode);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectorContainer ref={dropdownRef}>
      <CurrentLanguage onClick={() => setIsOpen(!isOpen)}>
        <FlagImage
          src={currentLanguage.flagUrl}
          alt={`Drapeau ${currentLanguage.name}`}
        />
        <LanguageName>{currentLanguage.name}</LanguageName>
      </CurrentLanguage>

      <DropdownMenu $isOpen={isOpen}>
        {languages.map((lang) => (
          <LanguageOption
            key={lang.code}
            $isActive={lang.code === i18n.language}
            onClick={() => handleLanguageClick(lang.code)}
          >
            <FlagImage src={lang.flagUrl} alt={`Drapeau ${lang.name}`} />
            {lang.name}
          </LanguageOption>
        ))}
      </DropdownMenu>
    </SelectorContainer>
  );
};

export default LanguageSelector;
