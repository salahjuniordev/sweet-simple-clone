import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
        content: "One team for identity, design, development, video and marketing — here is how we got here.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const team = [
  { name: "Mario Alvarez", role: "Founder & Brand Director", initials: "MA", note: "Runs every brand audit personally." },
  { name: "Ines Duarte", role: "Lead Engineer", initials: "ID", note: "Eighty-plus production launches." },
  { name: "Tomas Neri", role: "Product Designer", initials: "TN", note: "Designs systems, not screens." },
  { name: "Amara Bello", role: "Security Lead", initials: "AB", note: "Hardening, monitoring, incident response." },
  { name: "Sara Lindqvist", role: "Video & Motion", initials: "SL", note: "Short-form in a day, campaigns in a week." },
  { name: "Kofi Mensah", role: "Growth Marketer", initials: "KM", note: "Reports pipeline, not impressions." },
];

const values = [
  { t: "Evidence before taste", d: "Audits, tests and numbers decide direction. Opinions are inputs, not conclusions." },
  { t: "One team, no handoffs", d: "Strategy, design, code and marketing sit together, so nothing is lost in translation." },
  { t: "You own everything", d: "Source files, repositories and accounts are yours on final payment. No lock-in, ever." },
  { t: "Say the honest thing", d: "If you do not need the engagement, we will tell you and scope something smaller." },
  { t: "Ship, then improve", d: "We launch on a date and keep improving with data, instead of polishing in private." },
  { t: "Security is default", d: "Every build ships patched, backed up and monitored — not as an upsell." },
];

const timeline = [
  { y: "2018", t: "Studio founded", d: "Mario starts freelancing on brand identities for local retailers." },
  { y: "2020", t: "Development added", d: "Design work needed a build partner, so we became one." },
  { y: "2022", t: "Retainers launched", d: "Maintenance and security become an ongoing service, not a favour." },
  { y: "2024", t: "Fully remote team", d: "Six specialists across Europe and Africa, working async." },
  { y: "2026", t: "Nine services in-house", d: "From audit to marketing, delivered without external vendors." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">About us</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              A studio built to remove <span className="text-brand">the handoffs</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Mario Studio started as one designer with a logo backlog. It grew into a six-person
              remote team because clients kept asking the same question: why does every part of this
              have to come from a different company?
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-secondary">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Our story</h2>
              <p className="mt-5 text-muted-foreground">
                Every brand we touched had the same problem: a beautiful identity that fell apart
                the moment it hit a website, a slow site nobody dared to change, and a marketing
                team waiting on three vendors to agree.
              </p>
              <p className="mt-4 text-muted-foreground">
                So we built the studio the other way round. One team owns the brand, the build and
                the campaign, which means decisions made in the audit actually survive into the
                code that ships.
              </p>
            </div>
            <ol className="space-y-6">
              {timeline.map((s) => (
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
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">The team</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Six specialists, one shared board, no account managers between you and the people doing
            the work.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
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
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">What we value</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {values.map((v) => (
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
              Want to see how we'd approach <span className="text-brand">your brand</span>?
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Book a free audit <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
