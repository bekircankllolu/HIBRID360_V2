/**
 * LAB (monks dili) — Culture ailesinin metin yardımcıları.
 *
 * Onaylı metinler (messages / data) DEĞİŞMEZ; bu fonksiyonlar yalnız
 * SUNUMUNU değiştirir:
 *   - `unquote`: başlığa taşınan alıntının tırnakları (başlık artık alıntı
 *     kutusu değil, sayfanın konuşan cümlesi).
 *   - `splitVoice`: cümleyi iki sese böler — kalın sans baş + serif devam
 *     (monks: "Transforming brands" + "for the real-time world").
 *   - `sentenceCase`: büyük harfle yazılmış eski başlıklar (ör. "BİRLİKTE
 *     DAHA İYİYİZ") cümle düzenine iner; lab kuralı "büyük harf başlık yok".
 *     Kısaltmalar (AI, TV, CCO…) korunur.
 */

const QUOTES = /^[\s“”"«»„]+|[\s“”"«»„]+$/g;

export function unquote(text: string): string {
  return text.replace(QUOTES, "");
}

export interface Voice {
  head: string;
  tail: string;
}

/**
 * Önce doğal bir ayraçtan (":" ";" "—") böler (em-dash düşer); yoksa kelimelerin ~%40'ını
 * başa verir. Tek kelimelik metinde `tail` boştur.
 */
export function splitVoice(text: string, ratio = 0.4): Voice {
  const clean = text.trim();
  const pivot = clean.search(/[:;—](?=\s)/);
  if (pivot > 0 && pivot < clean.length - 1) {
    // İki nokta/noktalı virgül başta kalır; em-dash yalnız ayraçtır, düşer.
    const keep = clean[pivot] === "—" ? 0 : 1;
    return { head: clean.slice(0, pivot + keep).trim(), tail: clean.slice(pivot + 1).trim() };
  }
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 2) return { head: clean, tail: "" };
  const cut = Math.min(words.length - 1, Math.max(1, Math.round(words.length * ratio)));
  return { head: words.slice(0, cut).join(" "), tail: words.slice(cut).join(" ") };
}

/** Büyük harf kalması gereken kısaltmalar. */
const ACRONYMS = new Set(["AI", "TV", "SEO", "CCO", "CEO", "CTO", "COO", "UK", "US", "EU", "B2B", "B2C"]);

export function sentenceCase(text: string, locale: string): string {
  const words = text.trim().split(/(\s+)/);
  let first = true;
  return words
    .map((word) => {
      if (/^\s+$/.test(word) || word === "") return word;
      const bare = word.replace(/[^\p{L}\p{N}]/gu, "");
      if (ACRONYMS.has(bare)) {
        first = false;
        return word;
      }
      const lower = word.toLocaleLowerCase(locale);
      if (!first) return lower;
      first = false;
      return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
    })
    .join("");
}

/** "ZÜHRE DİDEM GÖDEK" → "Zühre Didem Gödek" (kısaltmalar korunur). */
export function titleCase(text: string, locale: string): string {
  return text
    .trim()
    .split(/(\s+)/)
    .map((word) => {
      if (/^\s+$/.test(word) || word === "") return word;
      const bare = word.replace(/[^\p{L}\p{N}]/gu, "");
      if (ACRONYMS.has(bare) || bare.length === 0) return word;
      const lower = word.toLocaleLowerCase(locale);
      return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
    })
    .join("");
}

/** 1 → "01" */
export function pad2(index: number): string {
  return String(index).padStart(2, "0");
}
