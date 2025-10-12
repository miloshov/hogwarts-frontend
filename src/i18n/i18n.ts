import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
import sr from './locales/sr.json';
import en from './locales/en.json';
import bg from './locales/bg.json';
import uk from './locales/uk.json';

const resources = {
  sr: { translation: sr },
  en: { translation: en },
  bg: { translation: bg },
  uk: { translation: uk },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sr', // default jezik
    fallbackLng: 'sr',
    debug: false,

    interpolation: {
      escapeValue: false, // React već escape-uje values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'hogwarts-language',
    },
  });

export default i18n;
