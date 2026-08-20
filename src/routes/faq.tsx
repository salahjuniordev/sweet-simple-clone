import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { faqs } from "@/lib/site-content";
import { services } from "@/lib/services-data";
import { serviceFaqs } from "@/lib/service-faqs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Answers on Process, Timelines & Ownership | Mario Studio" },
      {
        name: "description",
        content:
          "Find answers to common questions about Mario Studio services, pricing, timelines, ownership, support, technology, security and working remotely.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Mario Studio" },
      {
        property: "og:description",
        content: "Get answers about Mario Studio's services, pricing, timelines, support, ownership, technology, security and remote collaboration.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/faq" },
      { property: "og:image", content: "https://mariostudio.com/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a
            }
          }))
        }
      }
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useI18n();
  const { faq } = t;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{faq.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              {faq.heroTitlePrefix}<span className="text-brand">{faq.heroTitleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {faq.heroBody}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-black tracking-tight">{faq.generalTitle}</h2>
          <Accordion type="single" collapsible className="mt-6 w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`g-${i}`}>
                <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl space-y-12 px-6 py-16">
            {services.map((s) => {
              const items = serviceFaqs[s.slug] ?? [];
              if (items.length === 0) return null;
              return (
                <div key={s.slug}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-black tracking-tight">{s.title}</h2>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-1 text-sm font-semibold hover:text-brand"
                    >
                      {faq.servicePageLink} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <Accordion type="single" collapsible className="mt-4 w-full">
                    {items.map((f, i) => (
                      <AccordionItem key={f.q} value={`${s.slug}-${i}`}>
                        <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 md:flex-row">
            <h2 className="max-w-lg text-3xl font-black tracking-tight md:text-4xl">
              {faq.ctaTitle}
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              {faq.ctaButton} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
