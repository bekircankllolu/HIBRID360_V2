/**
 * LAB (monks "On our minds") — başlığın iki sesi.
 *
 * monks satırlarında başlığın ilk yarısı kalın grotesk, devamı ince serif
 * ("**Unlocking High-Value Users** with Machine Learning"). Bizim başlıklar
 * müşterinin yazdığı metin; bölme noktası uydurulmaz, başlığın kendi
 * noktalamasından okunur. Öncelik sırası:
 *
 *   1. İki nokta           "Logo Bir Başlangıçtır: Marka Kimliği…"
 *   2. Cümle sonu (. ? !)  "Yapay Zekâ Setin Yerine Geçmez. Setin Ufku Olur."
 *   3. Uzun tire (— –)
 *   4. İlk virgül          "Bir Kare, Bin Kelimeden Önce Gelir"
 *
 * Hiçbiri yoksa başlık tek ses kalır (`rest` boş). Noktalama işareti
 * `lead`'de kalır, `rest` baştaki boşluktan arındırılır — ikisi arasına
 * bileşen tek boşluk koyar, böylece düz metin olarak okunuşu değişmez.
 */

export interface InsightTitleParts {
  lead: string;
  rest: string;
}

const BREAKS: readonly RegExp[] = [
  /:\s+/,
  /[.?!]\s+(?=\S)/,
  /\s+[—–]\s+/,
  /,\s+/,
];

export function splitInsightTitle(title: string): InsightTitleParts {
  const trimmed = title.trim();

  for (const pattern of BREAKS) {
    const match = pattern.exec(trimmed);
    if (!match || match.index === 0) continue;

    const separator = match[0];
    const mark = separator.trim();
    // Tire önceki kelimeden boşlukla ayrılır ("Fikir —"); diğer işaretler
    // kelimeye bitişik ("Fikir:").
    const isDash = mark === "—" || mark === "–";
    const lead = `${trimmed.slice(0, match.index)}${isDash ? ` ${mark}` : mark}`;
    const rest = trimmed.slice(match.index + separator.length).trim();

    if (rest.length > 0) return { lead, rest };
  }

  return { lead: trimmed, rest: "" };
}
