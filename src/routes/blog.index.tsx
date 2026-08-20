import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPostDate } from "@/lib/blog-data";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/lib/cms-queries";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — Design, Development & Brand Insights | Mario Studio" },
      {
        name: "description",
        content:
          "Read Mario Studio's insights on branding, web design, development, performance, marketing, security and building better digital products.",
      },
      { property: "og:title", content: "Mario Studio Journal — Design & Development Insights" },
      {
        property: "og:description",
        content:
          "Explore Mario Studio's insights on branding, web design, development, performance, marketing, security and digital products.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const categories = useMemo(
    () => {
      if (!posts) return ["All"];
      return ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
    },
    [posts],
  );

  const visible = useMemo(() => {
    if (!posts) return [];
    let filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.excerpt.toLowerCase().includes(s)
      );
    }
    
    return filtered;
  }, [posts, active, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Journal</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black tracking-tight md:text-6xl">
              Notes from the <span className="text-brand">studio</span>
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              What we learn shipping brands, websites and campaigns — written so you can use it,
              whether or not you hire us.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  aria-pressed={active === c}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                    active === c
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border hover:border-brand hover:text-brand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="mt-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand" />
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {visible.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col justify-between rounded-2xl border border-border p-8 transition-colors hover:border-brand"
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">{post.category}</span>
                      <span>{formatPostDate(post.date)}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-bold leading-snug group-hover:text-brand">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                    Read article <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
