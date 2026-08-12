import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://mariostudio.com";

export const Route = createFileRoute("/api/public/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = createClient(
          process.env["VITE_SUPABASE_URL"]!,
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]!
        );

        const staticRoutes = [
          "/",
          "/about",
          "/services",
          "/blog",
          "/work",
          "/pricing",
          "/faq",
          "/contact",
          "/privacy",
          "/terms",
        ];

        const [
          { data: services },
          { data: posts },
          { data: caseStudies }
        ] = await Promise.all([
          supabase.from("cms_services").select("slug"),
          supabase.from("cms_posts").select("slug"),
          supabase.from("cms_case_studies").select("slug"),
        ]);

        const serviceRoutes = services?.map((s) => `/services/${s.slug}`) || [];
        const blogRoutes = posts?.map((p) => `/blog/${p.slug}`) || [];
        const workRoutes = caseStudies?.map((c) => `/work/${c.slug}`) || [];

        const allRoutes = [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...workRoutes];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route.startsWith("/services/") ? "0.9" : "0.7"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
          },
        });
      },
    },
  },
});
