'use client';

import { useState, useEffect } from 'react';
import { translations, Language, detectLanguageFromLocation, getBrowserLanguage } from './language';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem('language') as Language;
      
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
        setLoading(false);
        return;
      }

      try {
        const detectedLang = await detectLanguageFromLocation();
        setLanguage(detectedLang);
        localStorage.setItem('language', detectedLang);
      } catch {
        const browserLang = getBrowserLanguage();
        setLanguage(browserLang);
        localStorage.setItem('language', browserLang);
      }
      
      setLoading(false);
    };

    initLanguage();
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  return { language, changeLanguage, t, loading };
}
