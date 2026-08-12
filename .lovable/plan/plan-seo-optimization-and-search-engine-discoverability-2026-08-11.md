# Plan: SEO Optimization and Search Engine Discoverability

Implement comprehensive SEO strategy including sitemap, robots.txt, meta tags, and structured data to ensure the site is discoverable and optimized for search engines.

## Proposed Changes

### Configuration
- Create `public/robots.txt` to allow search engines to crawl the site and point to the sitemap.
- Create `src/routes/api/public/sitemap.xml.ts` (or similar) to generate a dynamic `sitemap.xml` for all routes including dynamic services, blog posts, and work case studies.

### SEO Meta Tags & OpenGraph
- Update all page routes to include unique and descriptive `head()` metadata:
    - `src/routes/about.tsx`: Story, Team, Values focus.
    - `src/routes/work.index.tsx`: Portfolio focus.
    - `src/routes/pricing.tsx`: Service comparison focus.
    - `src/routes/faq.tsx`: Help center focus.
    - `src/routes/services.$slug.tsx`: Per-service specific keywords.
    - `src/routes/blog.index.tsx`: Industry insights focus.
    - `src/routes/blog.$slug.tsx`: Article-specific metadata.
    - `src/routes/work.$slug.tsx`: Case-study specific metadata.

### Structured Data (JSON-LD)
- Inject JSON-LD scripts into relevant routes:
    - `Organization` on the homepage.
    - `Service` on service pages.
    - `BlogPosting` on blog article pages.
    - `FAQPage` on the FAQ and pricing pages.

## Technical Details

### Sitemap Generation
The sitemap will be a server route returning a `text/xml` response. It will iterate through:
- Static routes (`/`, `/about`, `/services`, `/blog`, `/work`, `/pricing`, `/faq`, `/contact`).
- Dynamic routes from `services-data.ts`, `blog-data.ts`, and `work-data.ts`.

### Meta Tag Structure
Each page will follow a standard pattern:
```typescript
head: () => ({
  meta: [
    { title: "Unique Title | Mario Studio" },
    { name: "description", content: "Unique description..." },
    { property: "og:title", content: "..." },
    { property: "og:description", content: "..." },
    { property: "og:type", content: "website/article" },
    { property: "og:url", content: "https://mariostudio.com/..." },
    { name: "twitter:card", content: "summary_large_image" },
    // Structured Data script
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "...",
        // ... properties
      }
    }
  ]
})
```

## User Review Required

- **Base URL:** I will use `https://mariostudio.com` as the default base URL for canonical tags and sitemaps. Is there a different production URL you prefer?
- **Keywords:** Should we focus on any specific regional keywords (e.g., "London web design") or keep it general digital services?
