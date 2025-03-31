import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Define a type for the translation resources

import frTranslation from "./locales/fr.json";
import enTranslation from "./locales/en.json";
import esTranslation from "./locales/es.json";
import itTranslation from "./locales/it.json";
import deTranslation from "./locales/de.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
    resources: {
      en: {
        translation: enTranslation as Record<string, string>,
      },
      fr: {
        translation: frTranslation as Record<string, string>,
      },
      es: {
        translation: esTranslation as Record<string, string>,
      },
      it: {
        translation: itTranslation as Record<string, string>,
      },
      de: {
        translation: deTranslation as Record<string, string>,
      },
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
