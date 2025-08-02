"use client";

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const [isClient, setIsClient] = useState(false);
  const translation = useI18nTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a safe translation function that works on both server and client
  const t = (key: string, options?: any): string => {
    if (!isClient) {
      // On server side, return the key as fallback
      return key;
    }
    return translation.t(key, options) as string;
  };

  return {
    t,
    i18n: translation.i18n,
    ready: translation.ready && isClient,
  };
} 