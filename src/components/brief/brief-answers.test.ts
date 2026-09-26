import { describe, expect, it } from "vitest";
import { briefQuestions } from "@/data/brief-builder";
import { EMPTY_ANSWERS, answerText } from "./brief-answers";

const byField = (field: string) => {
  const question = briefQuestions.find((q) => q.field === field);
  if (!question) throw new Error(`soru yok: ${field}`);
  return question;
};

describe("answerText", () => {
  it("tek seçimde değeri değil, dile göre etiketi döndürür", () => {
    const answers = { ...EMPTY_ANSWERS, what_making: "reklam_filmi" };
    expect(answerText(byField("what_making"), answers, "tr")).toBe("Reklam filmi");
    expect(answerText(byField("what_making"), answers, "en")).toBe("Ad film");
  });

  it("çoklu seçimi seçim sırasıyla virgülle birleştirir", () => {
    const answers = { ...EMPTY_ANSWERS, where_running: ["web", "tv"] };
    expect(answerText(byField("where_running"), answers, "tr")).toBe("Web, TV");
  });

  it("cevapsız soruda boş string döndürür (yer tutucu çağıranda)", () => {
    for (const question of briefQuestions) {
      expect(answerText(question, EMPTY_ANSWERS, "tr")).toBe("");
    }
  });

  it("serbest metni kırpar, iletişim adımında link ve e-postayı birleştirir", () => {
    const answers = {
      ...EMPTY_ANSWERS,
      who_for: "  Marka X  ",
      reference_link: "https://example.com",
      contact_email: "a@b.co",
    };
    expect(answerText(byField("who_for"), answers, "tr")).toBe("Marka X");
    expect(answerText(byField("reference_link"), answers, "tr")).toBe("https://example.com · a@b.co");
    expect(answerText(byField("reference_link"), { ...answers, reference_link: "" }, "tr")).toBe("a@b.co");
  });
});
