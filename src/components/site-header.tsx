import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./language-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/services", label: t.nav.services },
    { to: "/work", label: t.nav.work },
    { to: "/pricing", label: t.nav.pricing },
    { to: "/blog", label: t.nav.blog },
    { to: "/about", label: t.nav.about },
    { to: "/faq", label: t.nav.faq },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/logo.png" alt="Mario Studio" className="h-[60px] w-auto sm:h-[90px]" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-brand"
              activeProps={{ className: "text-brand" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions: language toggle + contact CTA + mobile menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle />

          <Link
            to="/start-a-project"
            search={{ service: undefined }}
            className="hidden rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand hover:text-brand-foreground sm:inline-flex sm:px-5 sm:text-sm"
          >
            {t.nav.contact}
          </Link>

          {/* Mobile menu sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t.mobile.menu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:border-brand/50 hover:text-brand lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-border bg-background sm:max-w-sm">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t.language.label}
                  </span>
                  <SheetClose asChild>
                    <button
                      type="button"
                      aria-label={t.mobile.close}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </SheetClose>
                </div>

                <nav className="flex flex-1 flex-col gap-1 py-8">
                  {links.map((l) => (
                    <SheetClose asChild key={l.to}>
                      <Link
                        to={l.to}
                        className="rounded-lg px-4 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-secondary hover:text-brand"
                        activeProps={{ className: "text-brand bg-secondary" }}
                      >
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <SheetClose asChild>
                  <Link
                    to="/start-a-project"
                    search={{ service: undefined }}
                    className="rounded-full bg-brand px-6 py-3.5 text-center text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t.nav.contact}
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
