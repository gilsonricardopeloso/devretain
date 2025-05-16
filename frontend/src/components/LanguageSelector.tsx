import { useLanguage } from '../hooks/useLanguage';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('pt-BR')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
          currentLanguage === 'pt-BR'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Português (Brasil)"
      >
        <span className="text-sm font-medium">PT-BR</span>
      </button>
      <button
        onClick={() => changeLanguage('en-US')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
          currentLanguage === 'en-US'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="English (US)"
      >
        <span className="text-sm font-medium">EN-US</span>
      </button>
    </div>
  );
} 