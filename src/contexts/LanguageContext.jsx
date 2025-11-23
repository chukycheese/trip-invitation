import React, { createContext, useState, useContext } from 'react';
import { en } from '../locales/en';
import { ko } from '../locales/ko';

const LanguageContext = createContext();

const translations = {
    en,
    ko
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ko');

    React.useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ko' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
