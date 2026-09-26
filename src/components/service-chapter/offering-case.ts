/**
 * LAB — hizmet kapsam satırlarının görüntü biçimi.
 *
 * `SERVICE_OFFERINGS` onaylı marka metni ve tamamı BÜYÜK HARF yazılmış
 * ("BRAND CONSULTANCY"). Lab dili büyük harf başlık kullanmıyor; veri
 * değiştirilmeden yalnız ekranda başlık düzenine çevrilir (monks kart
 * başlıkları: "Real-Time Brands", "Artificial Intelligence").
 *
 * - Kısaltmalar olduğu gibi kalır (TV, SEO, 3D …).
 * - Bağlaçlar/edatlar küçük harf (ilk kelime hariç).
 * - Tireli kelimenin her parçası büyük harfle başlar ("Re-Touch", "On-Site").
 * - Metin İngilizce: `toLowerCase()` yerel ayarsız (Türkçe "I" → "ı" olmasın).
 */

const ACRONYMS = new Set(["TV", "SEM", "SEO", "GIF", "AI", "CGI", "2D", "3D"]);
const MINOR_WORDS = new Set(["and", "with", "a", "an", "of", "the", "for", "to", "on", "in", "or"]);

function capitalise(part: string): string {
  if (ACRONYMS.has(part)) return part;
  const lower = part.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function offeringCase(text: string): string {
  return text
    .split(" ")
    .map((word, index) => {
      if (ACRONYMS.has(word)) return word;
      const lower = word.toLowerCase();
      if (index > 0 && MINOR_WORDS.has(lower)) return lower;
      return word.split("-").map(capitalise).join("-");
    })
    .join(" ");
}

/**
 * Sloganın son kelimesini (el çizimi vurgu için) sondaki noktalamadan ayırır.
 * "Pure. Simple. Powerful." → { head: "Pure. Simple. ", word: "Powerful", tail: "." }
 */
export function splitLastWord(text: string): { head: string; word: string; tail: string } {
  const match = /^([\s\S]*?)(\S+?)([.!?…,;:]*)$/.exec(text.trim());
  if (!match) return { head: "", word: text, tail: "" };
  return { head: match[1], word: match[2], tail: match[3] };
}
