import { useTranslation } from 'react-i18next';

const LANGUAGE_KEY = 'language';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANGUAGE_KEY, lng);
  };

  const getStoredLanguage = () => {
    return localStorage.getItem(LANGUAGE_KEY) || 'en-US';
  };

  const initializeLanguage = () => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage && i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    getStoredLanguage,
    initializeLanguage
  };
} 