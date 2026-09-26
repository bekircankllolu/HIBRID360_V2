import type { Locale } from "@/i18n/routing";

/** Kaynak dokümanda büyük harf yazılmış başlıkta korunacak kısaltmalar. */
const ACRONYMS = new Set(["KVKK", "AI", "GDPR"]);

/**
 * "GİZLİLİK POLİTİKASI" → "Gizlilik politikası", "KVKK AYDINLATMA METNİ" →
 * "KVKK aydınlatma metni" (lab kuralı: büyük harf başlık yok, kısaltmalar
 * korunur). Yalnız tamamı büyük harf olan başlığa dokunur; metin
 * değişmez, yalnız görünümü. `<title>` (metadata) kaynağın aynısı kalır.
 */
export function sentenceCaseTitle(title: string, locale: Locale): string {
  if (title !== title.toLocaleUpperCase(locale)) return title;
  const words = title.split(" ").map((word) =>
    ACRONYMS.has(word) ? word : word.toLocaleLowerCase(locale),
  );
  const joined = words.join(" ");
  return joined.charAt(0).toLocaleUpperCase(locale) + joined.slice(1);
}
