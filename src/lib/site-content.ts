import { useI18n } from "@/lib/i18n";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export type Faq = { q: string; a: string };

/** English defaults kept for any non-hook consumers / type inference. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Mario Studio rebuilt our site and identity in six weeks. Demo requests doubled in the first month and we finally look like the company we are.",
    name: "Lina Okafor",
    role: "Co-founder, Northwind SaaS",
    initials: "LO",
  },
  {
    quote:
      "The brand audit alone was worth it. They found three inconsistencies our agency had shipped for years, then fixed the whole system.",
    name: "Marc Delaunay",
    role: "Head of Marketing, Verta Foods",
    initials: "MD",
  },
  {
    quote:
      "One team for design, development and video means nothing gets lost between vendors. Turnaround went from weeks to days.",
    name: "Sofia Marchetti",
    role: "Creative Director, Atlas Studio",
    initials: "SM",
  },
  {
    quote:
      "Their maintenance and security retainer caught a vulnerability before it ever became an incident. Peace of mind, monthly.",
    name: "Daniel Reyes",
    role: "CTO, Palmera Retail",
    initials: "DR",
  },
];

export const faqs: Faq[] = [
  {
    q: "How long does a typical project take?",
    a: "A focused landing page ships in 1–2 weeks, a full website in 4–6 weeks, and a complete brand identity plus site in 6–10 weeks. We give you a dated milestone plan before we start.",
  },
  {
    q: "What does a project cost?",
    a: "Every service page lists three transparent tiers. Most brand-and-website engagements land between the Starter and Growth plans, and anything custom gets a fixed quote after a free 30-minute scoping call.",
  },
  {
    q: "Can I hire you for just one service?",
    a: "Yes. You can book web development, graphic design, UI/UX, video editing, a brand audit, maintenance, security or marketing on its own. Bundling simply removes handoffs between vendors.",
  },
  {
    q: "Do you work with clients in other time zones?",
    a: "We work fully remote with clients across Europe, Africa and North America. You get a shared board, a weekly call and async updates so nobody waits on a timezone.",
  },
  {
    q: "Who owns the files and the code?",
    a: "You do. On final payment you receive the full source repository, editable design files and every export, with no vendor lock-in.",
  },
  {
    q: "What happens after launch?",
    a: "You can leave with everything, or keep us on a maintenance and security retainer that covers updates, backups, monitoring, uptime checks and small monthly improvements.",
  },
];

/** Locale-aware hooks — use these in components so copy follows the language toggle. */
export function useTestimonials(): Testimonial[] {
  const { t } = useI18n();
  return t.siteContent.testimonials;
}

export function useFaqs(): Faq[] {
  const { t } = useI18n();
  return t.siteContent.faqs;
}
