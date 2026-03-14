import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Locale, localeConfig, translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('gloss-locale');
    return (saved as Locale) || 'en';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('gloss-locale', newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    return (translations[locale] as any)[key] || key;
  }, [locale]);

  const dir = localeConfig[locale].dir;
  const isRtl = dir === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [dir, locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
