export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  industry: string;
  year: string;
  services: string[];
  serviceSlugs: string[];
  challenge: string;
  approach: string[];
  results: { label: string; value: string }[];
  quote?: { text: string; name: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "northwind-saas",
    client: "Northwind SaaS",
    title: "A rebrand and rebuild that doubled demo requests",
    summary:
      "New identity, new marketing site and a conversion-focused demo funnel, shipped in six weeks.",
    industry: "B2B software",
    year: "2026",
    services: ["Identity Branding", "Web Development", "UI/UX Design"],
    serviceSlugs: ["identity-branding", "web-development", "ui-ux-design"],
    challenge:
      "Northwind looked like a side project next to funded competitors, and their site buried the demo request three clicks deep.",
    approach: [
      "Ran a nine-point brand audit and a competitor grid to find open visual territory.",
      "Built a full identity system: logo suite, colour, typography and tone of voice.",
      "Rebuilt the site with a single, repeated demo call-to-action and server-rendered pages.",
      "Wired analytics and funnel tracking so marketing could see where people dropped.",
    ],
    results: [
      { label: "Demo requests", value: "+108%" },
      { label: "Load time", value: "0.9s" },
      { label: "Bounce rate", value: "-31%" },
      { label: "Delivery", value: "6 weeks" },
    ],
    quote: {
      text: "Mario Studio rebuilt our site and identity in six weeks. Demo requests doubled in the first month.",
      name: "Lina Okafor",
      role: "Co-founder, Northwind SaaS",
    },
  },
  {
    slug: "verta-foods",
    client: "Verta Foods",
    title: "Packaging and campaign system for a retail rollout",
    summary:
      "A consistent design system across packaging, social and in-store print for a 400-store launch.",
    industry: "Food & beverage",
    year: "2025",
    services: ["Graphic Design", "Brand Audit", "Digital Marketing"],
    serviceSlugs: ["graphic-design", "brand-audit", "digital-marketing"],
    challenge:
      "Three years of agency work had produced four different logo versions and no colour standard, which retailers kept rejecting.",
    approach: [
      "Audited every asset in circulation and scored it for consistency.",
      "Standardised colour with print-verified references across substrates.",
      "Produced a campaign pack of 40 assets plus editable social templates.",
      "Ran a paid launch campaign against the new creative.",
    ],
    results: [
      { label: "Stores at launch", value: "400" },
      { label: "Asset turnaround", value: "-60%" },
      { label: "Campaign CTR", value: "3.4%" },
      { label: "Print rejections", value: "0" },
    ],
    quote: {
      text: "The brand audit alone was worth it. They found three inconsistencies our agency had shipped for years.",
      name: "Marc Delaunay",
      role: "Head of Marketing, Verta Foods",
    },
  },
  {
    slug: "atlas-studio",
    client: "Atlas Studio",
    title: "Video production pipeline that cut turnaround to days",
    summary:
      "One team for edit, motion and delivery, replacing three freelancers and a lot of waiting.",
    industry: "Creative agency",
    year: "2025",
    services: ["Video Editing", "Graphic Design", "UI/UX Design"],
    serviceSlugs: ["video-editing", "graphic-design", "ui-ux-design"],
    challenge:
      "Every campaign video passed through three vendors, so feedback loops took weeks and brand details drifted at each step.",
    approach: [
      "Built a reusable motion template kit tied to the brand system.",
      "Set a single review board with versioned cuts and timestamped comments.",
      "Standardised export presets for every platform and aspect ratio.",
    ],
    results: [
      { label: "Turnaround", value: "3 days" },
      { label: "Videos / month", value: "18" },
      { label: "Vendors", value: "1" },
      { label: "Revision rounds", value: "-45%" },
    ],
    quote: {
      text: "One team for design, development and video means nothing gets lost between vendors.",
      name: "Sofia Marchetti",
      role: "Creative Director, Atlas Studio",
    },
  },
  {
    slug: "palmera-retail",
    client: "Palmera Retail",
    title: "Hardening and maintaining a store doing $2M a year",
    summary:
      "A security remediation sprint followed by an ongoing maintenance retainer with real monitoring.",
    industry: "E-commerce",
    year: "2026",
    services: ["Web Security", "Web Maintenance", "Web Development"],
    serviceSlugs: ["web-security", "web-maintenance", "web-development"],
    challenge:
      "An unpatched plugin stack, no tested backups and no monitoring on a storefront processing orders every minute.",
    approach: [
      "Ran a full vulnerability scan and patched every outdated component.",
      "Enforced multi-factor access and removed dormant admin accounts.",
      "Set restore-tested backups plus uptime, integrity and error monitoring.",
      "Moved to a monthly retainer covering updates and small improvements.",
    ],
    results: [
      { label: "Uptime", value: "99.99%" },
      { label: "Critical issues", value: "0 open" },
      { label: "Checkout speed", value: "+22%" },
      { label: "Incidents", value: "None since" },
    ],
    quote: {
      text: "Their maintenance and security retainer caught a vulnerability before it ever became an incident.",
      name: "Daniel Reyes",
      role: "CTO, Palmera Retail",
    },
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudyForService(serviceSlug: string) {
  return caseStudies.find((c) => c.serviceSlugs.includes(serviceSlug));
}
