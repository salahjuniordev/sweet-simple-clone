export type Language = "en" | "fr";

export const translations = {
  en: {
    nav: {
      services: "Services",
      work: "Work",
      pricing: "Pricing",
      blog: "Blog",
      about: "About",
      faq: "FAQs",
      contact: "Start a project",
      contactAlt: "Contact",
    },
    language: {
      label: "Language",
      en: "EN",
      fr: "FR",
      toggle: "Switch to French",
    },
    mobile: {
      menu: "Open menu",
      close: "Close menu",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  fr: {
    nav: {
      services: "Services",
      work: "Réalisations",
      pricing: "Tarifs",
      blog: "Blog",
      about: "À propos",
      faq: "FAQ",
      contact: "Démarrer un projet",
      contactAlt: "Contact",
    },
    language: {
      label: "Langue",
      en: "EN",
      fr: "FR",
      toggle: "Passer en anglais",
    },
    mobile: {
      menu: "Ouvrir le menu",
      close: "Fermer le menu",
    },
    footer: {
      rights: "Tous droits réservés.",
    },
  },
} as const;

export type Translations = typeof translations;
export type TranslationKey = keyof Translations["en"];
