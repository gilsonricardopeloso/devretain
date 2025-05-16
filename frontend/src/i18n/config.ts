import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

const LANGUAGE_KEY = 'language';
const storedLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en-US';

const resources = {
  'en-US': {
    translation: enUS
  },
  'pt-BR': {
    translation: ptBR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_KEY,
      caches: ['localStorage']
    }
  });

export default i18n; 