import { describe, expect, it } from "vitest";
import { sentenceCaseTitle } from "./legal-title";

describe("sentenceCaseTitle", () => {
  it("Türkçe büyük harf başlığı yerel kurallarla cümle düzenine çevirir", () => {
    expect(sentenceCaseTitle("GİZLİLİK POLİTİKASI", "tr")).toBe("Gizlilik politikası");
    expect(sentenceCaseTitle("SORUMLU YAPAY ZEKÂ POLİTİKASI", "tr")).toBe(
      "Sorumlu yapay zekâ politikası",
    );
  });

  it("kısaltmaları korur", () => {
    expect(sentenceCaseTitle("KVKK AYDINLATMA METNİ", "tr")).toBe("KVKK aydınlatma metni");
    expect(sentenceCaseTitle("RESPONSIBLE AI POLICY", "en")).toBe("Responsible AI policy");
  });

  it("zaten karışık düzendeki başlığa dokunmaz", () => {
    expect(sentenceCaseTitle("Erişilebilirlik Beyanı", "tr")).toBe("Erişilebilirlik Beyanı");
  });
});
