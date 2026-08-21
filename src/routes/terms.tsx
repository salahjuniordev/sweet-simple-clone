import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/lib/i18n";

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

function TermsPage() {
  const { t } = useI18n();
  const sections = t.legal.termsSections;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{t.legal.label}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{t.legal.termsTitle}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.legal.lastUpdated}</p>

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
