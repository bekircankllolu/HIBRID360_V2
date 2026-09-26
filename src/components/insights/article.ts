/**
 * Think & Thank yazı sayfasının saf mantığı — tarayıcısız test edilebilsin.
 */

/** Çekme alıntı için makul uzunluk: kısa bir iddia cümlesi, paragraf değil. */
const QUOTE_MIN = 24;
const QUOTE_MAX = 180;

/**
 * Editoryal çekme alıntı (pull quote): yazının KENDİ son cümlesi — metin
 * uydurulmaz. Bu yazılarda son cümle neredeyse hep yazının iddiası
 * ("Büyük fikir, havadan gelmez: doğru stratejinin içinden büyür.").
 *
 * Tek paragraflık yazıda alıntı yok (aynı cümle hemen yanında tekrar
 * etmesin); cümle çok kısa/uzunsa da yok.
 */
export function pullQuoteOf(paragraphs: readonly string[]): string | null {
  if (paragraphs.length < 2) return null;
  const last = paragraphs[paragraphs.length - 1]?.trim() ?? "";
  const sentences = last.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const sentence = sentences[sentences.length - 1]?.trim() ?? "";
  if (sentence.length < QUOTE_MIN || sentence.length > QUOTE_MAX) return null;
  return sentence;
}

/**
 * "Diğer yazılar": listede bu yazıdan sonra gelen `count` yazı, sona
 * gelince başa döner. Yazının kendisi asla dönmez.
 */
export function relatedPostsOf<T extends { slug: string }>(
  posts: readonly T[],
  slug: string,
  count = 3,
): T[] {
  const index = posts.findIndex((post) => post.slug === slug);
  const others = posts.length - (index === -1 ? 0 : 1);
  const take = Math.min(count, others);
  const result: T[] = [];
  for (let step = 1; result.length < take; step += 1) {
    const post = posts[(Math.max(index, -1) + step) % posts.length];
    if (post && post.slug !== slug) result.push(post);
  }
  return result;
}
