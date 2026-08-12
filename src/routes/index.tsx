import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { testimonials, faqs } from "@/lib/site-content";
import { formatPostDate } from "@/lib/blog-data";
import { serviceIcons } from "@/lib/service-icons";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterForm } from "@/components/newsletter-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroSlider } from "@/components/hero-slider";
import { useQuery } from "@tanstack/react-query";
import { getServices, getPosts, getCaseStudies } from "@/lib/cms-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mario Studio — Digital Services, Brand Design & Web Development" },
      {
        name: "description",
        content:
          "Mario Studio is a full-service digital partner building sharp brands and fast websites. Experts in web development, identity branding, UI/UX, and digital marketing.",
      },
      { property: "og:title", content: "Mario Studio — Digital Services & Brand Design" },
      {
        property: "og:description",
        content:
          "Web development, identity branding, UI/UX, video editing, brand audit, maintenance, security and digital marketing under one studio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Mario Studio",
          url: "https://mariostudio.com",
          logo: "https://mariostudio.com/logo.png",
          description: "Full-service digital studio specializing in brand design and web development.",
          sameAs: [
            "https://twitter.com/mariostudio",
            "https://linkedin.com/company/mariostudio",
            "https://instagram.com/mariostudio"
          ]
        }
      }
    ],
  }),
  component: Index,
});


const steps = [
  { n: "01", t: "Audit", d: "We map your brand, product and competitors before touching pixels." },
  { n: "02", t: "Design", d: "Identity and interfaces built as one system, not separate files." },
  { n: "03", t: "Build", d: "Development, video and content produced in-house." },
  { n: "04", t: "Grow", d: "Maintenance, security and marketing keep the work compounding." },
];

function Index() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const { data: caseStudies } = useQuery({
    queryKey: ["case-studies"],
    queryFn: getCaseStudies,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="top">
        <HeroSlider />

        <section className="border-b border-border bg-primary text-primary-foreground">
          <ScrollReveal direction="up">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
              {[
                ["15", "Services in-house"],
                ["120+", "Projects delivered"],
                ["48h", "Average response"],
                ["99.9%", "Uptime maintained"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-4xl font-black text-brand">{v}</div>
                  <div className="mt-1 text-sm opacity-80">{l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by teams at
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {["Northwind", "Kora Labs", "Verdant", "Atlas Foods", "Pulse Fit", "Meridian"].map((n) => (
                <span
                  key={n}
                  className="text-lg font-black uppercase tracking-tight text-muted-foreground/60 transition-colors hover:text-brand"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-6 py-24">
          <ScrollReveal direction="up">
            <h2 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
              Everything your brand needs, <span className="text-brand">under one roof</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Over 15 premium disciplines that work together — so strategy, design and code never contradict each other.
            </p>
          </ScrollReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services?.map((s, idx) => {
              const Icon = serviceIcons[s.icon as keyof typeof serviceIcons];
              return (
                <ScrollReveal key={s.slug} direction="up" delay={idx * 0.1}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group block rounded-2xl border border-border bg-card p-7 transition-colors hover:border-brand"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-foreground transition-colors group-hover:bg-brand">
                      {Icon && <Icon className="h-6 w-6" />}
                    </div>
                    <h3 className="mt-5 flex items-center gap-1 text-lg font-bold">
                      {s.title}
                      <ArrowUpRight className="h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.desc_short}</p>
                    <p className="mt-4 text-sm font-bold">
                      From <span className="text-brand">{(s.plans as any)?.[0]?.price}</span>
                    </p>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section id="process" className="border-y border-border bg-secondary">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">How we work</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="border-t-2 border-brand pt-5">
                  <div className="text-sm font-black text-brand">{s.n}</div>
                  <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-14 md:flex-row">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Not sure which step you're on?
              </h2>
              <p className="mt-3 max-w-lg text-sm opacity-80">
                Book a free 30-minute scoping call. We'll tell you what to fix first — even if it
                isn't something we'd bill for.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Book a call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="work" className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Work</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Selected projects</h2>
            </div>
            <Link to="/work" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand">
              All case studies <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caseStudies?.slice(0, 3).map((c) => (
              <Link
                key={c.slug}
                to="/work/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border p-7 transition-colors hover:border-brand"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">{c.industry}</p>
                <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-brand">{c.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                <p className="mt-5 text-2xl font-black text-brand">{(c.results as any)[0]?.value}</p>
                <p className="text-xs text-muted-foreground">{(c.results as any)[0]?.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Why teams stay with <span className="text-brand">Mario Studio</span>
            </h2>
            <ul className="space-y-6">
              {[
                ["One team, no handoffs", "Your designer, developer and marketer sit in the same room."],
                ["Security is not an add-on", "Every build ships hardened, monitored and backed up."],
                ["Measured, not decorated", "We report on conversions, load times and pipeline."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-brand" />
                  <div>
                    <h3 className="font-bold">{t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="testimonials" className="border-y border-border bg-brand-soft">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Testimonials</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
              What clients say after launch
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-8"
                >
                  <Quote className="h-7 w-7 text-brand" />
                  <blockquote className="mt-5 text-base leading-relaxed">"{t.quote}"</blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {t.initials}
                    </span>
                    <span>
                      <span className="block font-bold">{t.name}</span>
                      <span className="block text-sm text-muted-foreground">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Journal</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">From the studio</h2>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand">
              All articles <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts?.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group rounded-2xl border border-border p-7 transition-colors hover:border-brand"
              >
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-brand">{post.category}</span>
                  <span>{formatPostDate(post.date)}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug group-hover:text-brand">{post.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">FAQs</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Questions we get <span className="text-brand">every week</span>
              </h2>
              <p className="mt-5 text-sm text-muted-foreground">
                Still unsure? Email us and we'll answer honestly, even if the answer is that you
                don't need us yet.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="newsletter" className="border-t border-border bg-secondary">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Newsletter</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                One useful email a month
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Practical notes on branding, performance and security. No sales sequences, no fluff,
                unsubscribe in one click.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>

        <section id="contact" className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Let's build something worth <span className="text-brand">looking at</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-80">
              Tell us about your project and get a free brand audit within 48 hours.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:hello@mariostudio.com"
                className="inline-flex items-center rounded-full border border-primary-foreground/30 px-8 py-4 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
              >
                hello@mariostudio.com
              </a>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />

    </div>
  );
}
