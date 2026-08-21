import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPostDate } from "@/lib/blog-data";
import { getAuthor } from "@/lib/authors";
import { getPostBySlug, getPosts } from "@/lib/cms-queries";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getPostBySlug(params.slug);
      if (!post) throw notFound();
      return { post };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — Mario Studio" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const author = getAuthor(post.category);
    return {
      meta: [
        { title: `${post.title} | Mario Studio Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://mariostudio.com/blog/${post.slug}` },
        { property: "article:published_time", content: post.date },
        { property: "og:image", content: (post as any).image || "https://mariostudio.com/logo.png" },
        { property: "article:author", content: author.name },
        { name: "twitter:card", content: "summary_large_image" },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: author.name
            },
            publisher: {
              "@type": "Organization",
              name: "Mario Studio",
              logo: {
                "@type": "ImageObject",
                url: "https://mariostudio.com/logo.png"
              }
            }
          }
        }
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function PostNotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black">Article not found</h1>
        <p className="mt-4 text-muted-foreground">This post may have been moved or renamed.</p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to the blog
        </Link>
      </div>
    </Shell>
  );
}

function BlogPost() {
  const { post } = Route.useLoaderData() as any;
  const author = getAuthor(post.category);
  
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const more = posts
    ? posts
        .filter((p) => p.slug !== post.slug)
        .sort((a, b) => (a.category === post.category ? -1 : 1))
        .slice(0, 3)
    : [];

  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">{post.category}</span>
          <span>{formatPostDate(post.date)}</span>
          <span>{post.read_time}</span>
        </div>
        {(post as any).image && (
          <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
            <img
              src={(post as any).image}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        )}
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="mt-10 space-y-6 text-base leading-relaxed">
          {(post.body as string[]).map((p: string) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <aside className="mt-14 flex flex-col gap-5 rounded-2xl border border-border p-8 sm:flex-row">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {author.initials}
          </span>
          <div>
            <h2 className="font-bold">{author.name}</h2>
            <p className="text-sm text-brand">{author.role}</p>
            <p className="mt-3 text-sm text-muted-foreground">{author.bio}</p>
          </div>
        </aside>

        <div className="mt-8 rounded-2xl border border-border bg-brand-soft p-8">
          <h2 className="text-2xl font-bold">Want this done for you?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a free brand and website audit within 48 hours.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
          >
            Start a project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Related articles</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl border border-border p-6 transition-colors hover:border-brand"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">{p.category}</div>
                <h3 className="mt-3 text-lg font-bold group-hover:text-brand">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
