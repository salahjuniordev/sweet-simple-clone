import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useQuery } from "@tanstack/react-query";
import { getCaseStudies } from "@/lib/cms-queries";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Digital Design & Development Case Studies | Mario Studio" },
      {
        name: "description",
        content:
          "Explore Mario Studio case studies in branding, web development, UI/UX, marketing and digital design, with measurable results and real business outcomes.",
      },
      { property: "og:title", content: "Our Work — Case Studies | Mario Studio" },
      { property: "og:description", content: "See how Mario Studio helps businesses grow through branding, web development, UI/UX, marketing and digital design." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/work" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ["case-studies"],
    queryFn: getCaseStudies,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Work</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Projects, and what they <span className="text-brand">actually changed</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Every case study lists the problem, what we did and the numbers afterwards. No mood
              boards without outcomes.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-8 px-6 py-20">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand" />
            </div>
          ) : (
            caseStudies?.map((c) => (
              <Link
                key={c.slug}
                to="/work/$slug"
                params={{ slug: c.slug }}
                className="group grid gap-8 rounded-3xl border border-border p-8 transition-colors hover:border-brand md:grid-cols-[1.4fr_0.6fr] md:p-10"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">{c.industry}</span>
                    <span>{c.year}</span>
                  </div>
                  <h2 className="mt-5 flex items-start gap-2 text-2xl font-bold leading-snug group-hover:text-brand md:text-3xl">
                    {c.title}
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                  </h2>
                  <p className="mt-3 max-w-xl text-muted-foreground">{c.summary}</p>
                  <p className="mt-5 text-sm font-semibold">{c.client} · {(c.services as string[]).join(" · ")}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 self-center">
                  {(c.results as any[]).slice(0, 4).map((r) => (
                    <div key={r.label}>
                      <div className="text-2xl font-black text-brand">{r.value}</div>
                      <div className="text-xs text-muted-foreground">{r.label}</div>
                    </div>
                  ))}
                </div>
              </Link>
            ))
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
