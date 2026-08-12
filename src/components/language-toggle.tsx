import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.language.toggle}
      className={cn(
        "group relative inline-flex h-9 items-center rounded-full border border-border bg-secondary p-1 text-xs font-bold tracking-wide transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand",
        className,
      )}
    >
      <span
        className={cn(
          "relative z-10 flex h-7 w-8 items-center justify-center rounded-full transition-colors",
          lang === "en" ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {t.language.en}
      </span>
      <span
        className={cn(
          "relative z-10 flex h-7 w-8 items-center justify-center rounded-full transition-colors",
          lang === "fr" ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {t.language.fr}
      </span>
      <span
        className={cn(
          "absolute left-1 top-1 h-7 w-8 rounded-full bg-brand shadow-sm transition-transform duration-200 ease-out",
          lang === "fr" && "translate-x-8",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
