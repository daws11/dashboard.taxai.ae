"use client";

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n on client side with plugins
    if (!i18n.isInitialized) {
      const initI18n = async () => {
        const { default: LanguageDetector } = await import('i18next-browser-languagedetector');
        const { initReactI18next } = await import('react-i18next');
        
        i18n
          .use(LanguageDetector)
          .use(initReactI18next)
          .init({
            fallbackLng: 'en',
            debug: process.env.NODE_ENV === 'development',
            interpolation: {
              escapeValue: false,
            },
            detection: {
              order: ['localStorage', 'navigator', 'htmlTag'],
              caches: ['localStorage'],
            },
          });
      };
      
      initI18n();
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 