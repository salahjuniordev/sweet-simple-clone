import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Mario Studio" },
      {
        name: "description",
        content:
          "The terms covering Mario Studio engagements: scope, payment, revisions, intellectual property, confidentiality and cancellation.",
      },
      { property: "og:title", content: "Terms of Service | Mario Studio" },
      { property: "og:description", content: "Scope, payment, ownership and cancellation terms for our engagements." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/terms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    h: "1. Scope of work",
    p: "Each engagement is defined by a written proposal listing deliverables, timeline and price. Work outside that proposal is quoted separately before it begins. Nothing on this website constitutes an offer or a fixed price.",
  },
  {
    h: "2. Fees and payment",
    p: "Fixed-scope projects are invoiced 50% on signature and 50% on delivery. Retainers are invoiced monthly in advance. Invoices are due within 14 days; late payments may pause active work.",
  },
  {
    h: "3. Client responsibilities",
    p: "You agree to provide content, brand assets, access and feedback within the agreed windows. Delays on your side shift the timeline by an equivalent amount and may affect scheduled availability.",
  },
  {
    h: "4. Revisions",
    p: "Every package includes the number of revision rounds stated in the proposal. Additional rounds are billed at our standard hourly rate, agreed in writing before we start them.",
  },
  {
    h: "5. Intellectual property",
    p: "On final payment, ownership of the delivered work transfers to you, including source files and repositories. We retain ownership of pre-existing tools, frameworks and internal components used to build it, licensed to you perpetually for the delivered work.",
  },
  {
    h: "6. Third-party licences",
    p: "Fonts, stock media, plugins and hosting are licensed in your name and billed at cost unless the proposal states otherwise. You are responsible for maintaining those licences after handover.",
  },
  {
    h: "7. Portfolio rights",
    p: "We may show the delivered work in our portfolio and case studies unless you ask us in writing not to. Confidential metrics are only published with your approval.",
  },
  {
    h: "8. Confidentiality",
    p: "Both parties keep non-public information disclosed during the engagement confidential and use it only to perform the work. This survives the end of the engagement.",
  },
  {
    h: "9. Warranty and support",
    p: "We fix defects in delivered work reported within 30 days of handover at no charge. Feature changes, third-party breakages and content edits fall outside that warranty and are covered by a maintenance retainer.",
  },
  {
    h: "10. Liability",
    p: "Our total liability for any claim is limited to the fees paid for the engagement giving rise to it. Neither party is liable for indirect or consequential loss.",
  },
  {
    h: "11. Cancellation",
    p: "Either party may cancel a project in writing. You pay for work completed up to that date; the deposit is non-refundable. Retainers can be cancelled with 30 days' notice.",
  },
  {
    h: "12. Governing law",
    p: "These terms are governed by the laws applicable at our place of business, and disputes will be resolved in those courts unless the parties agree to mediation first.",
  },
];

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Legal</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Terms of service</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 January 2026</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-3 text-muted-foreground">{s.p}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
