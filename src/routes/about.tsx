import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mario Studio — Our Story, Remote Team & Design Values" },
      {
        name: "description",
        content:
          "Learn about Mario Studio, a remote digital studio built to combine strategy, branding, design, development and marketing under one team.",
      },
      { property: "og:title", content: "About Mario Studio — Story, Team & Values" },
      {
        property: "og:description",
        content: "Meet Mario Studio, a remote digital studio bringing strategy, branding, design, development and marketing together under one team.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/about" },
      { property: "og:image", content: "https://mariostudio.com/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  const { about } = t;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{about.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              {about.heroTitlePrefix}<span className="text-brand">{about.heroTitleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {about.heroBody}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-secondary">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">{about.storyTitle}</h2>
              <p className="mt-5 text-muted-foreground">
                {about.storyP1}
              </p>
              <p className="mt-4 text-muted-foreground">
                {about.storyP2}
              </p>
            </div>
            <ol className="space-y-6">
              {about.timeline.map((s) => (
                <li key={s.y} className="flex gap-5 border-l-2 border-brand pl-5">
                  <div>
                    <div className="text-sm font-black text-brand">{s.y}</div>
                    <h3 className="mt-1 font-bold">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{about.teamTitle}</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {about.teamSubtitle}
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-lg font-black text-brand-foreground">
                  {m.initials}
                </div>
                <h3 className="mt-5 text-lg font-bold">{m.name}</h3>
                <p className="text-sm font-semibold text-brand">{m.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-brand-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">{about.valuesTitle}</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {about.values.map((v) => (
                <div key={v.t} className="border-t-2 border-brand pt-5">
                  <h3 className="text-lg font-bold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 md:flex-row">
            <h2 className="max-w-xl text-3xl font-black tracking-tight md:text-4xl">
              {about.ctaTitlePrefix}<span className="text-brand">{about.ctaTitleHighlight}</span>{about.ctaTitleSuffix}
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              {about.ctaButton} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
