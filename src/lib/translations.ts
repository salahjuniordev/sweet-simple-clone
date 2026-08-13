import { commonEn, commonFr } from "./i18n-strings/common";
import { publicEn, publicFr } from "./i18n-strings/public";
import { publicBEn, publicBFr } from "./i18n-strings/public-b";
import { adminEn, adminFr } from "./i18n-strings/admin";

export type Language = "en" | "fr";

export const translations = {
  en: { ...commonEn, ...publicEn, ...publicBEn, ...adminEn },
  fr: { ...commonFr, ...publicFr, ...publicBFr, ...adminFr },
};

export type Translations = typeof translations;
export type TranslationKey = keyof Translations["en"];
