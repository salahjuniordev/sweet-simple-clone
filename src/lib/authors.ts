export type Author = { name: string; role: string; initials: string; bio: string };

type AuthorEntry = { name: string; initials: string; role: { en: string; fr: string }; bio: { en: string; fr: string } };

const authors: Record<string, AuthorEntry> = {
  Branding: {
    name: "Mario Alvarez",
    initials: "MA",
    role: { en: "Founder & Brand Director", fr: "Fondateur et directeur de marque" },
    bio: {
      en: "Mario has led brand systems for retail, SaaS and food companies for twelve years. He runs every audit at the studio personally.",
      fr: "Mario dirige des systèmes de marque pour des entreprises de retail, de SaaS et d'agroalimentaire depuis douze ans. Il mène personnellement chaque audit du studio.",
    },
  },
  "Web Development": {
    name: "Ines Duarte",
    initials: "ID",
    role: { en: "Lead Engineer", fr: "Ingénieure principale" },
    bio: {
      en: "Ines builds server-rendered sites with strict performance budgets and has shipped over eighty production launches.",
      fr: "Ines conçoit des sites rendus côté serveur avec des budgets de performance stricts et a livré plus de quatre-vingts mises en production.",
    },
  },
  "UI/UX Design": {
    name: "Tomas Neri",
    initials: "TN",
    role: { en: "Product Designer", fr: "Designer produit" },
    bio: {
      en: "Tomas designs interfaces as component systems and spends most of his review time in the browser, not the design tool.",
      fr: "Tomas conçoit les interfaces comme des systèmes de composants et passe l'essentiel de ses revues dans le navigateur, pas dans l'outil de design.",
    },
  },
  "Web Security": {
    name: "Amara Bello",
    initials: "AB",
    role: { en: "Security Lead", fr: "Responsable sécurité" },
    bio: {
      en: "Amara handles hardening, incident cleanup and monitoring for every site the studio maintains.",
      fr: "Amara s'occupe du durcissement, du nettoyage d'incidents et de la supervision de chaque site que le studio maintient.",
    },
  },
};

const fallback: AuthorEntry = {
  name: "Mario Studio Team",
  initials: "MS",
  role: { en: "Studio", fr: "Studio" },
  bio: {
    en: "Written by the team that designs, builds and maintains the work described here.",
    fr: "Rédigé par l'équipe qui conçoit, développe et maintient les projets décrits ici.",
  },
};

export function getAuthor(category: string, lang: "en" | "fr" = "en"): Author {
  const entry = authors[category] ?? fallback;
  return {
    name: entry.name,
    initials: entry.initials,
    role: entry.role[lang],
    bio: entry.bio[lang],
  };
}
