import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { posts, formatPostDate } from "@/lib/blog-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Project Requested | Mario Studio" },
      {
        name: "description",
        content: "We've received your request and will be in touch within 48 hours.",
      },
      { property: "og:title", content: "Thanks — Your Brief Is In | Mario Studio" },
      { property: "og:description", content: "We received your brief and will reply within 48 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { t } = useI18n();
  const { thankYou } = t;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
            <h1 className="mt-7 text-4xl font-black tracking-tight md:text-5xl">
              {thankYou.titlePrefix}<span className="text-brand">{thankYou.titleHighlight}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              {thankYou.body}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                {thankYou.seeWork} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand"
              >
                {thankYou.backHome}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-black tracking-tight">{thankYou.whileWaitTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
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
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
