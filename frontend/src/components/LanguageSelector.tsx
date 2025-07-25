import React from 'react';
interface Language {
  code: string;
  name: string;
}
interface LanguageSelectorProps {
  onSelectLanguage: (code: string) => void;
  selectedLanguage?: string;
}
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onSelectLanguage,
  selectedLanguage = 'en'
}) => {
  const languages: Language[] = [{
    code: 'en',
    name: 'English'
  }, {
    code: 'fr',
    name: 'Français'
  }, {
    code: 'pid',
    name: 'Pidgin'
  }];
  return <div className="flex flex-col items-center space-y-4">
      <h2 className="text-lg font-montserrat font-medium text-gray-700">
        Select your language
      </h2>
      <div className="flex flex-col sm:flex-row gap-3">
        {languages.map(lang => <button key={lang.code} onClick={() => onSelectLanguage(lang.code)} className={`px-6 py-3 rounded-full text-base transition-all ${selectedLanguage === lang.code ? 'bg-primary text-white' : 'bg-softGray text-gray-700 hover:bg-gray-200'}`}>
            {lang.name}
          </button>)}
      </div>
    </div>;
};