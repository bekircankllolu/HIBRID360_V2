import { describe, expect, it } from "vitest";
import { insightsPosts } from "@/data/insights";
import { splitInsightTitle } from "./split-insight-title";

describe("splitInsightTitle", () => {
  it("iki noktada böler, işaret ilk yarıda kalır", () => {
    expect(splitInsightTitle("Logo Bir Başlangıçtır: Marka Kimliği Nasıl Yaşayan Bir Dünyaya Dönüşür?")).toEqual({
      lead: "Logo Bir Başlangıçtır:",
      rest: "Marka Kimliği Nasıl Yaşayan Bir Dünyaya Dönüşür?",
    });
  });

  it("iki nokta yoksa cümle sonunda böler", () => {
    expect(splitInsightTitle("Yapay Zekâ Setin Yerine Geçmez. Setin Ufku Olur.")).toEqual({
      lead: "Yapay Zekâ Setin Yerine Geçmez.",
      rest: "Setin Ufku Olur.",
    });
  });

  it("uzun tirede böler, tire ilk yarıda boşlukla kalır", () => {
    expect(splitInsightTitle("Fikir — sonra biçim")).toEqual({ lead: "Fikir —", rest: "sonra biçim" });
  });

  it("son çare olarak ilk virgülde böler", () => {
    expect(splitInsightTitle("Bir Kare, Bin Kelimeden Önce Gelir")).toEqual({
      lead: "Bir Kare,",
      rest: "Bin Kelimeden Önce Gelir",
    });
  });

  it("iki nokta virgülden önceliklidir", () => {
    expect(splitInsightTitle("Parlaklık, Doku, Akış: Food Stylingin Teknik Araç Kutusu").lead).toBe(
      "Parlaklık, Doku, Akış:",
    );
  });

  it("bölünemeyen başlık tek ses kalır", () => {
    expect(splitInsightTitle("One Frame Comes Before a Thousand Words")).toEqual({
      lead: "One Frame Comes Before a Thousand Words",
      rest: "",
    });
  });

  it("sondaki noktalama boş ikinci yarı üretmez", () => {
    expect(splitInsightTitle("Tek cümle.")).toEqual({ lead: "Tek cümle.", rest: "" });
  });

  it("ondalık sayıyı cümle sonu saymaz", () => {
    expect(splitInsightTitle("Sürüm 2.5 geldi")).toEqual({ lead: "Sürüm 2.5 geldi", rest: "" });
  });

  it("gerçek başlıkların hiçbirinde metin kaybolmaz", () => {
    for (const post of insightsPosts) {
      for (const title of [post.title_tr, post.title_en]) {
        const { lead, rest } = splitInsightTitle(title);
        const joined = rest ? `${lead} ${rest}` : lead;
        expect(joined.replace(/\s+/g, " ")).toBe(title.trim().replace(/\s+/g, " "));
      }
    }
  });
});
