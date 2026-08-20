import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/cms-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/lib/services-data";
import { faqs } from "@/lib/site-content";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Transparent Tiers for Design & Development | Mario Studio" },
      {
        name: "description",
        content:
          "Explore Mario Studio pricing for web development and digital services, with transparent packages, fixed quotes and flexible monthly retainers.",
      },
      { property: "og:title", content: "Pricing — Compare All Services | Mario Studio" },
      {
        property: "og:description",
        content: "Explore Mario Studio's digital service pricing, including web development packages, fixed quotes and flexible monthly retainers.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const included = [
  "A named lead you talk to directly",
  "Shared board with weekly written updates",
  "All source files and repositories on handover",
  "Fixed quote before work starts — no surprise invoices",
];

function PricingPage() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const webDev = services?.find(s => s.slug === 'web-development');
  const plans = (webDev?.plans as any[]) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Pricing</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Web development <span className="text-brand">pricing</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Prices for our web development tiers. Anything custom gets a fixed quote
              after a free 30-minute scoping call.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p, idx) => (
              <div
                key={p.name}
                className={`flex flex-col h-full rounded-2xl border bg-card p-8 ${
                  p.featured ? "border-brand ring-2 ring-brand" : "border-border"
                }`}
              >
                {p.featured && (
                  <span className="mb-4 self-start rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-black">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.note}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex gap-2 text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                    p.featured
                      ? "bg-brand text-brand-foreground"
                      : "border border-border hover:border-brand"
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs text-muted-foreground text-center">
            All prices in USD, excluding tax. Retainers are billed monthly and can be cancelled anytime.
          </p>
        </section>

        <section className="border-y border-border bg-secondary">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Included in every plan</h2>
              <ul className="mt-8 space-y-4">
                {included.map((i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <span className="text-sm text-muted-foreground">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Bundle and save</h2>
              <p className="mt-5 text-muted-foreground">
                Booking brand, website and marketing together removes vendor handoffs and typically
                lands 15–20% below the sum of the individual packages. Tell us the scope and we will
                price the bundle in writing.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Get a bundled quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Pricing questions</h2>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`p-${i}`}>
                <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
