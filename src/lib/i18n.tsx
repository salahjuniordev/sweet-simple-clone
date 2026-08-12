import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";

const STORAGE_KEY = "mario-studio-language";
const DEFAULT_LANG: Language = "en";

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations[Language];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (window.localStorage.getItem(STORAGE_KEY) as Language | null) : null;
    if (stored && (stored === "en" || stored === "fr")) {
      setLangState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }, [lang, hydrated]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === "en" ? "fr" : "en"));

  const value: I18nContextValue = {
    lang,
    setLang,
    toggleLang,
    t: translations[lang] as Translations[Language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
