import type { Work } from "@/types/content";

/**
 * Vaka sayfasının (work/[slug]) saf mantığı — tarayıcısız test edilebilsin.
 */

/** Doğrudan oynatılabilir video dosyası mı (R2/CDN mp4·webm)? YouTube/Vimeo değil. */
export function isDirectVideo(url: string | null | undefined): url is string {
  if (!url) return false;
  const path = url.split(/[?#]/)[0] ?? "";
  return /\.(mp4|webm|m4v|mov)$/i.test(path);
}

/**
 * Sıradaki vaka: envanter sırasında bir sonraki iş, sondaysa başa döner.
 * Tek iş varsa (ya da iş listede yoksa) sıradaki vaka yoktur.
 */
export function nextWorkOf(works: readonly Work[], slug: string): Work | null {
  if (works.length < 2) return null;
  const index = works.findIndex((work) => work.slug === slug);
  if (index === -1) return null;
  return works[(index + 1) % works.length] ?? null;
}
