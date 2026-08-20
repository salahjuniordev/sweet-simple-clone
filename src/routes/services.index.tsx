import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/cms-queries";
import { serviceIcons } from "@/lib/service-icons";
import { useI18n } from "@/lib/i18n";
import { useLocalizedServices } from "@/lib/i18n-data/localize";


export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Digital Services — Branding, Design & Development | Mario Studio" },
      {
        name: "description",
        content:
          "Explore Mario Studio's digital services, including web development, branding, UI/UX design, graphic design, video, marketing, AI automation and more.",
      },
      { property: "og:title", content: "Digital Services & Pricing | Mario Studio" },
      {
        property: "og:description",
        content:
          "Comprehensive digital disciplines that work together — so strategy, design and code never contradict each other.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const { data: servicesRaw, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
  const services = useLocalizedServices(servicesRaw);

  const visible = useMemo(() => {
    if (!services) return [];
    if (!search) return services;
    const s = search.toLowerCase();
    return services.filter(ser => 
      ser.title.toLowerCase().includes(s) || 
      ser.desc_short.toLowerCase().includes(s) ||
      (ser.benefits as string[])?.some(b => b.toLowerCase().includes(s))
    );
  }, [services, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <img src="/logo.png" alt="Mario Studio logo" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold transition-colors hover:text-brand"
          >
            {t.servicesPage.backHome}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              {t.servicesPage.titleA} <span className="text-brand">{t.servicesPage.titleB}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t.servicesPage.sub}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t.servicesPage.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand" />
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible?.map((s) => {
              const Icon = serviceIcons[s.icon as keyof typeof serviceIcons];
              return (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-brand"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-foreground transition-colors group-hover:bg-brand">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h2 className="mt-5 flex items-center gap-1 text-lg font-bold">
                    {s.title}
                    <ArrowUpRight className="h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.desc_short}</p>
                  <p className="mt-4 text-sm font-bold">
                    {t.servicesPage.from} <span className="text-brand">{(s.plans as any)?.[0]?.price}</span>
                  </p>
                </Link>
              );
            })}
            {visible?.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                {t.servicesPage.noResults}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          {t.servicesPage.copyrightPrefix(new Date().getFullYear())} {t.servicesPage.rights}
        </div>
      </footer>
    </div>
  );
}
