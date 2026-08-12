export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "brand-audit-checklist",
    title: "The brand audit checklist we run before any redesign",
    excerpt:
      "Before we touch a single pixel we run a nine-point audit. Here is the exact checklist, so you can run it yourself.",
    category: "Branding",
    date: "2026-07-28",
    readTime: "6 min read",
    body: [
      "Most redesigns fail because they start with taste instead of evidence. A brand audit replaces opinion with a map of what your brand actually communicates today, across every surface a customer touches.",
      "We start with inventory: every logo variant, deck template, social profile, invoice and packaging item currently in circulation. Teams are usually surprised by how many versions exist and how few are on-brand.",
      "Next comes consistency scoring. Each asset gets rated on logo usage, colour accuracy, typography and tone of voice. Anything below a passing score goes into a remediation list with an owner and a date.",
      "Then we look outward: a competitor grid showing where your visual territory overlaps with everyone else's. If three competitors use the same blue and the same geometric sans, differentiation is a design problem, not a marketing budget problem.",
      "Finally we test comprehension. Five customers, five minutes, one question: what does this company do and who is it for? If the answers diverge, the identity is not doing its job yet — and that is exactly what the redesign has to fix.",
    ],
  },
  {
    slug: "website-speed-conversions",
    title: "Why a one-second delay quietly costs you customers",
    excerpt:
      "Performance is a conversion feature. Here is how we get sites under one second without stripping the design.",
    category: "Web Development",
    date: "2026-07-14",
    readTime: "5 min read",
    body: [
      "Speed is not a technical vanity metric. Every additional second before a page becomes usable measurably reduces the number of people who stay long enough to convert, and it compounds across every paid click you buy.",
      "The biggest wins are rarely exotic. Correctly sized and modern-format images, fonts loaded without blocking render, and shipping less JavaScript to the browser usually account for most of the improvement.",
      "We serve pages rendered on the server so the first thing the browser receives is real content, not an empty shell waiting on a bundle. Interactivity is layered on afterwards.",
      "Third-party scripts deserve special attention. Chat widgets, heatmaps and tag managers are frequently the single slowest thing on a marketing site. We load them late, or not at all.",
      "We treat performance as a budget, not a one-off cleanup: a defined threshold measured on every deploy, so the site that launches fast is still fast a year later.",
    ],
  },
  {
    slug: "ui-ux-handoff-that-works",
    title: "A design handoff that developers actually enjoy",
    excerpt:
      "Design systems break at the handoff. These four habits keep design and build in sync from day one.",
    category: "UI/UX Design",
    date: "2026-06-30",
    readTime: "4 min read",
    body: [
      "The classic failure is a beautiful mockup thrown over a wall. What arrives in the browser then drifts, because the file described a picture rather than a system.",
      "Habit one: name tokens, not values. Colours, spacing and radii should have semantic names in the design file that match the names in the codebase, so nobody has to translate hex codes.",
      "Habit two: design the states. Empty, loading, error, long text, and the smallest supported screen. If those are missing, developers invent them, and the invention becomes the product.",
      "Habit three: review in the browser, not in the design tool. Real type rendering, real content and real interaction reveal issues no static frame will.",
      "Habit four: keep one shared component list. When design and code agree on what a Card is, a redesign becomes an update rather than a rebuild.",
    ],
  },
  {
    slug: "small-business-web-security",
    title: "Web security basics every small business is missing",
    excerpt:
      "You do not need an enterprise budget to close the gaps attackers actually use. Start with these six.",
    category: "Web Security",
    date: "2026-06-12",
    readTime: "7 min read",
    body: [
      "Attacks on small sites are overwhelmingly automated. Bots scan for known weaknesses at scale, which means the fix is rarely sophisticated — it is discipline applied consistently.",
      "Keep the platform and every plugin current. The majority of compromised sites we clean up were running a component with a public patch that shipped months earlier.",
      "Enforce strong authentication for anyone with admin access, with multi-factor turned on. A reused password on a single marketing account is the most common way in.",
      "Take backups you have actually restored. An untested backup is a hope, not a recovery plan; we restore to a staging environment on a schedule to prove it works.",
      "Add monitoring so you find out from a system, not from a customer. Uptime checks, file integrity alerts and error tracking turn a silent incident into a same-hour response.",
      "Finally, reduce the surface: remove unused plugins, retire old subdomains and revoke access for people who left. Every dormant thing is something nobody is watching.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
