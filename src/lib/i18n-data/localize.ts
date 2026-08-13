import { useI18n } from "@/lib/i18n";
import { servicesFr } from "./services-fr";
import { postsFr } from "./posts-fr";
import { caseStudiesFr } from "./case-studies-fr";

export type Overrides = Record<string, Record<string, unknown>>;

/** Merge a French override (keyed by slug) onto a content row. */
export function localizeItem<T extends { slug?: string | null }>(
  item: T,
  overrides: Overrides,
  lang: string,
): T {
  if (lang !== "fr" || !item || !item.slug) return item;
  const patch = overrides[item.slug];
  return patch ? ({ ...item, ...patch } as T) : item;
}

export function localizeList<T extends { slug?: string | null }>(
  items: T[] | undefined | null,
  overrides: Overrides,
  lang: string,
): T[] {
  if (!items) return [];
  return items.map((i) => localizeItem(i, overrides, lang));
}

export function useLocalizedServices<T extends { slug?: string | null }>(items: T[] | undefined | null) {
  const { lang } = useI18n();
  return localizeList(items, servicesFr, lang);
}

export function useLocalizedService<T extends { slug?: string | null }>(item: T | undefined | null) {
  const { lang } = useI18n();
  return item ? localizeItem(item, servicesFr, lang) : item;
}

export function useLocalizedPosts<T extends { slug?: string | null }>(items: T[] | undefined | null) {
  const { lang } = useI18n();
  return localizeList(items, postsFr, lang);
}

export function useLocalizedPost<T extends { slug?: string | null }>(item: T | undefined | null) {
  const { lang } = useI18n();
  return item ? localizeItem(item, postsFr, lang) : item;
}

export function useLocalizedCaseStudies<T extends { slug?: string | null }>(items: T[] | undefined | null) {
  const { lang } = useI18n();
  return localizeList(items, caseStudiesFr, lang);
}

export function useLocalizedCaseStudy<T extends { slug?: string | null }>(item: T | undefined | null) {
  const { lang } = useI18n();
  return item ? localizeItem(item, caseStudiesFr, lang) : item;
}
