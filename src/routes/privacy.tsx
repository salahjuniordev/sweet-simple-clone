import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/lib/i18n";

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

function PrivacyPage() {
  const { t } = useI18n();
  const sections = t.legal.privacySections;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{t.legal.label}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{t.legal.privacyTitle}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.legal.lastUpdated}</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-3 text-muted-foreground">{s.p}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold">{t.legal.contactHeading}</h2>
            <p className="mt-3 text-muted-foreground">
              {t.legal.contactBody}{" "}
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
