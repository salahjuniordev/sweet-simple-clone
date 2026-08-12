export type Author = { name: string; role: string; initials: string; bio: string };

const authors: Record<string, Author> = {
  Branding: {
    name: "Mario Alvarez",
    role: "Founder & Brand Director",
    initials: "MA",
    bio: "Mario has led brand systems for retail, SaaS and food companies for twelve years. He runs every audit at the studio personally.",
  },
  "Web Development": {
    name: "Ines Duarte",
    role: "Lead Engineer",
    initials: "ID",
    bio: "Ines builds server-rendered sites with strict performance budgets and has shipped over eighty production launches.",
  },
  "UI/UX Design": {
    name: "Tomas Neri",
    role: "Product Designer",
    initials: "TN",
    bio: "Tomas designs interfaces as component systems and spends most of his review time in the browser, not the design tool.",
  },
  "Web Security": {
    name: "Amara Bello",
    role: "Security Lead",
    initials: "AB",
    bio: "Amara handles hardening, incident cleanup and monitoring for every site the studio maintains.",
  },
};

const fallback: Author = {
  name: "Mario Studio Team",
  role: "Studio",
  initials: "MS",
  bio: "Written by the team that designs, builds and maintains the work described here.",
};

export function getAuthor(category: string): Author {
  return authors[category] ?? fallback;
}
