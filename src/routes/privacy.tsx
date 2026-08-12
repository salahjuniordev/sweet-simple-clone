import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Mario Studio" },
      {
        name: "description",
        content:
          "How Mario Studio collects, uses and protects personal data submitted through our contact form, newsletter and client projects.",
      },
      { property: "og:title", content: "Privacy Policy | Mario Studio" },
      { property: "og:description", content: "What data we collect, why, and how to have it removed." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    h: "What we collect",
    p: "When you submit the contact form we store the name, email, company, service interest, budget range and message you provide. If you subscribe to the newsletter we store your email address only. Our hosting provider records standard server logs, including IP address and user agent, for security and abuse prevention.",
  },
  {
    h: "Why we collect it",
    p: "To reply to your enquiry, prepare a proposal, deliver contracted work, send the newsletter you asked for, and keep the site secure. We do not sell personal data or share it with advertisers.",
  },
  {
    h: "Legal basis",
    p: "We process contact data on the basis of your request to enter into a contract, newsletter data on the basis of your consent, and security logs on the basis of our legitimate interest in protecting the service.",
  },
  {
    h: "How long we keep it",
    p: "Enquiries are kept for 24 months, then deleted. Client project data is retained for the duration of the engagement plus seven years where tax or contract law requires it. Newsletter data is kept until you unsubscribe.",
  },
  {
    h: "Processors we use",
    p: "We rely on a small number of vendors to run the studio: cloud hosting, email delivery, analytics and project management tooling. Each is bound by a data processing agreement and processes data only on our instructions.",
  },
  {
    h: "Cookies",
    p: "The site uses essential cookies required for it to function. Any analytics we run is aggregated and does not build advertising profiles of individual visitors.",
  },
  {
    h: "Your rights",
    p: "You can request access to, correction of, or deletion of your personal data, object to processing, or request a portable copy. Email hello@mariostudio.com and we will respond within 30 days.",
  },
  {
    h: "Security",
    p: "Data is encrypted in transit, access is limited to team members who need it, and credentials are rotated regularly. If a breach affects your data we will notify you and the relevant authority without undue delay.",
  },
  {
    h: "Changes",
    p: "If this policy changes materially we will update the date below and, where the change affects you, notify you by email.",
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Legal</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Privacy policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 January 2026</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-3 text-muted-foreground">{s.p}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold">Contact</h2>
            <p className="mt-3 text-muted-foreground">
              Questions about this policy? Email{" "}
              <a href="mailto:hello@mariostudio.com" className="font-semibold text-brand">
                hello@mariostudio.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
