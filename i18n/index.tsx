import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform, NativeModules } from 'react-native';
import { en } from './locales/en';
import { id } from './locales/id';
import { tr } from './locales/tr';

export type Language = 'tr' | 'en' | 'id';
export type TranslationKeys = keyof typeof tr;

const translations: Record<Language, Record<string, string>> = { tr, en, id };

const LANG_STORAGE_KEY = '@vakti_selam_language';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKeys) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'tr',
  setLanguage: async () => { },
  t: (key) => key,
});

function getDeviceLanguage(): Language {
  try {
    let deviceLang = 'tr';
    if (Platform.OS === 'ios') {
      deviceLang = NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'tr';
    } else {
      deviceLang = NativeModules.I18nManager?.localeIdentifier || 'tr';
    }
    const langCode = deviceLang.substring(0, 2).toLowerCase();
    if (langCode === 'en') return 'en';
    if (langCode === 'id' || langCode === 'in') return 'id';
    return 'tr';
  } catch {
    return 'tr';
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
        if (stored && (stored === 'tr' || stored === 'en' || stored === 'id')) {
          setLanguageState(stored as Language);
        } else {
          const deviceLang = getDeviceLanguage();
          setLanguageState(deviceLang);
        }
      } catch {
        setLanguageState('tr');
      }
      setLoaded(true);
    };
    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch { }
  }, []);

  const t = useCallback((key: TranslationKeys): string => {
    return translations[language]?.[key] || translations['tr']?.[key] || key;
  }, [language]);

  if (!loaded) return null;

  return (
    <I18nContext.Provider value= {{ language, setLanguage, t }
}>
  { children }
  </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
];
