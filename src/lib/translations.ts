import { commonEn, commonFr } from "./i18n-strings/common";
import { publicEn, publicFr } from "./i18n-strings/public";
import { publicBEn, publicBFr } from "./i18n-strings/public-b";
import { adminEn, adminFr } from "./i18n-strings/admin";
import { projectIntakeEn, projectIntakeFr } from "./i18n-strings/project-intake";
import { legalEn, legalFr } from "./i18n-strings/legal";

export type Language = "en" | "fr";

export const translations = {
  en: { ...commonEn, ...publicEn, ...publicBEn, ...adminEn, ...projectIntakeEn, ...legalEn },
  fr: { ...commonFr, ...publicFr, ...publicBFr, ...adminFr, ...projectIntakeFr, ...legalFr },
};

export type Translations = typeof translations;
export type TranslationKey = keyof Translations["en"];
