import type { Work } from "@/types/content";

/**
 * Works envanteri (lab — monks "work inventory" uyarlaması) saf mantığı.
 * Bileşenlerden ayrı: tarayıcı gerektirmeden test edilebilsin.
 */

export const ALL = "__all__";
/** "Daha fazla göster" adımı: ilk ekranda ve her tıklamada eklenen satır. */
export const PAGE_SIZE = 12;
/** monks "Popular Cases": üç kart. */
export const FEATURED_LIMIT = 3;

export type Locale = "tr" | "en";

export interface WorkFilters {
  year: string;
  service: string;
  industry: string;
}

export const EMPTY_FILTERS: WorkFilters = { year: ALL, service: ALL, industry: ALL };

export function optionsOf(works: readonly Work[], pick: (work: Work) => string | null): string[] {
  return Array.from(
    new Set(works.map(pick).filter((value): value is string => Boolean(value))),
  ).sort((a, b) => a.localeCompare(b));
}

export function yearsOf(works: readonly Work[]): number[] {
  return Array.from(new Set(works.map((work) => work.year))).sort((a, b) => b - a);
}

export function workTitle(work: Work, locale: Locale, fallback: string): string {
  const localized = locale === "tr" ? work.title_tr : work.title_en;
  return (
    localized ??
    work.title_en ??
    work.title_tr ??
    work.content_format ??
    work.service ??
    fallback
  );
}

/**
 * monks "Solutions" sütununun karşılığı. Şemada tek bir hizmet alanı var;
 * format ve sektör de işin kapsamını anlattığı için aynı etiket dizisine
 * giriyor. Yinelenen ve boş değerler atılır, sıra: hizmet → format → sektör.
 */
export function solutionsOf(work: Work): string[] {
  return Array.from(
    new Set(
      [work.service, work.content_format, work.industry].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  );
}

export function filterWorks(works: readonly Work[], filters: WorkFilters): Work[] {
  return works.filter((work) => {
    if (filters.year !== ALL && String(work.year) !== filters.year) return false;
    if (filters.service !== ALL && work.service !== filters.service) return false;
    if (filters.industry !== ALL && work.industry !== filters.industry) return false;
    return true;
  });
}

export function activeFilterCount(filters: WorkFilters): number {
  return Object.values(filters).filter((value) => value !== ALL).length;
}

/**
 * Öne çıkan kartlar: envanterde `is_featured` işaretli işler. Hiçbiri
 * işaretli değilse en yeni işler gösterilir ve çağıran bölümü "Son işler"
 * diye adlandırır — öne çıkmamış bir işi "öne çıkan" diye etiketlemeyiz.
 */
export function pickFeatured(works: readonly Work[]): { works: Work[]; curated: boolean } {
  const curated = works.filter((work) => work.is_featured);
  if (curated.length > 0) return { works: curated.slice(0, FEATURED_LIMIT), curated: true };
  return { works: works.slice(0, FEATURED_LIMIT), curated: false };
}
