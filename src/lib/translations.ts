import { commonEn, commonFr } from "./i18n-strings/common";
import { publicEn, publicFr } from "./i18n-strings/public";
import { adminEn, adminFr } from "./i18n-strings/admin";

export type Language = "en" | "fr";

export const translations = {
  en: { ...commonEn, ...publicEn, ...adminEn },
  fr: { ...commonFr, ...publicFr, ...adminFr },
};

export type Translations = typeof translations;
export type TranslationKey = keyof Translations["en"];
