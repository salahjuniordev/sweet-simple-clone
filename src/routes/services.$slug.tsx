import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/cms-queries";
import { serviceIcons } from "@/lib/service-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { serviceFaqs } from "@/lib/service-faqs";
import { caseStudyForService } from "@/lib/work-data";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LeadCaptureForm } from "@/components/lead-capture-form";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    try {
      const service = await getServiceBySlug(params.slug);
      if (!service) throw notFound();
      return { service };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — Mario Studio" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — Digital Services | Mario Studio`;
    const description = `${service.tagline}. ${service.desc_short} Expert ${service.title.toLowerCase()} starting from ${(service.plans as any)?.[0]?.price ?? "$0"}.`;
    const faqItems = serviceFaqs[service.slug as keyof typeof serviceFaqs] ?? [];
    const absoluteUrl = `https://mariostudio.com/services/${service.slug}`;
    const imageUrl = `https://mariostudio.com/logo.png`; // Using the static logo as default OG image

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: absoluteUrl },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
        {
          "script:ld+json": [
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.title,
              description: service.desc_short,
              provider: {
                "@type": "Organization",
                name: "Mario Studio",
                url: "https://mariostudio.com",
                logo: imageUrl
              },
              offers: {
                "@type": "AggregateOffer",
                lowPrice: (service.plans as any)?.[0]?.price.replace(/[^0-9.]/g, '') || "0",
                priceCurrency: "USD",
                offerCount: (service.plans as any)?.length || 0
              }
            },
            faqItems.length > 0 ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map(f => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.a
                }
              }))
            } : null
          ].filter(Boolean)
        }
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-black">We don't offer that service</h1>
        <Link to="/services" className="mt-4 inline-block font-semibold text-brand">
          Browse all services
        </Link>
      </div>
    </div>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData() as any;
  const Icon = serviceIcons[service.icon as keyof typeof serviceIcons];
  const [selectedTier, setSelectedTier] = useState<string>((service.plans as any[])?.[0]?.name || "Basic");
  
  const { data: allServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const others = allServices?.filter((s) => s.slug !== service.slug).slice(0, 4) || [];
  const faqItems = serviceFaqs[service.slug as keyof typeof serviceFaqs] ?? [];
  const relatedCase = caseStudyForService(service.slug);
  
  const currentPlan = (service.plans as any[]).find(p => p.name === selectedTier) || (service.plans as any[])[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-soft blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20">
            <ScrollReveal direction="left">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1] tracking-tight md:text-6xl">
                {service.title}
              </h1>
              <p className="mt-4 text-xl font-bold text-brand">{service.tagline}</p>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{service.intro}</p>
              <a
                href="#quote"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Request a quote <ArrowUpRight className="h-4 w-4" />
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-14 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight">What you get out of it</h2>
              <ul className="mt-6 space-y-4">
                {(service.benefits as string[]).map((b) => (
                  <li key={b} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="text-xl font-bold">Deliverables</h2>
              <ul className="mt-5 space-y-3">
                {(service.deliverables as string[]).map((d) => (
                  <li key={d} className="flex items-center gap-3 border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-border bg-secondary">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Pricing & <span className="text-brand">Scope</span></h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Select a tier to view estimated deliverables and get an instant quote request.
                </p>
              </div>
              
              <div className="flex gap-1 p-1 bg-background border border-border rounded-full self-start">
                {(service.plans as any[]).map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedTier(p.name)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedTier === p.name 
                        ? "bg-brand text-brand-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
              <ScrollReveal direction="left">
                <div className="space-y-8">
                  <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-12 w-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{currentPlan.name} Package</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black">{currentPlan.price}</span>
                          <span className="text-sm text-muted-foreground">{currentPlan.note}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-brand mb-4">Features</h4>
                        <ul className="space-y-3">
                          {currentPlan.features.map((f: string) => (
                            <li key={f} className="flex gap-3 text-sm">
                              <Check className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-brand mb-4">Estimated Scope</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          This tier is designed for {currentPlan.name.toLowerCase()} requirements. 
                          Includes complete {service.title.toLowerCase()} strategy, asset creation, and 
                          {currentPlan.features.length} core deliverables optimized for conversion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <LeadCaptureForm serviceSlug={service.slug} tier={selectedTier} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {faqItems.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-black tracking-tight">
              {service.title} <span className="text-brand">FAQs</span>
            </h2>
            <Accordion type="single" collapsible className="mt-8 w-full">
              {faqItems.map((f, i) => (
                <AccordionItem key={f.q} value={`s-${i}`}>
                  <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {relatedCase && (
          <section className="border-y border-border">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Related case study</p>
              <Link
                to="/work/$slug"
                params={{ slug: relatedCase.slug }}
                className="group mt-6 grid gap-8 rounded-3xl border border-border p-8 transition-colors hover:border-brand md:grid-cols-[1.4fr_0.6fr] md:p-10"
              >
                <div>
                  <h2 className="text-2xl font-bold leading-snug group-hover:text-brand md:text-3xl">
                    {relatedCase.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-muted-foreground">{relatedCase.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    Read the case study <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 self-center">
                  {(relatedCase.results as any[]).slice(0, 4).map((r) => (
                    <div key={r.label}>
                      <div className="text-2xl font-black text-brand">{r.value}</div>
                      <div className="text-xs text-muted-foreground">{r.label}</div>
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Don't see exactly <span className="text-brand">what you need?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-80">
              We offer custom retainers and project-based pricing for complex requirements. 
              Let's hop on a call and build a custom package for you.
            </p>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-10 py-5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Book a Strategy Call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-black tracking-tight">Other services</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="rounded-xl border border-border p-5 transition-colors hover:border-brand"
              >
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.desc_short}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
