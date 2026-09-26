import { describe, expect, it } from "vitest";
import { pad2, sentenceCase, splitVoice, titleCase, unquote } from "./lab-text";

describe("unquote", () => {
  it("strips typographic quotes around a sentence, keeps inner ones", () => {
    expect(unquote("“Geleceğin görsel deneyimlerini üretiyoruz.”")).toBe(
      "Geleceğin görsel deneyimlerini üretiyoruz.",
    );
    expect(unquote("“Kalıpların “dışında” düşünmek”")).toBe("Kalıpların “dışında” düşünmek");
  });
});

describe("splitVoice", () => {
  it("splits at a natural pivot first", () => {
    expect(splitVoice("Beyond production: an AI-native creative organization")).toEqual({
      head: "Beyond production:",
      tail: "an AI-native creative organization",
    });
    expect(splitVoice("Doğru ekip — deneyimli ekip")).toEqual({ head: "Doğru ekip", tail: "deneyimli ekip" });
  });

  it("falls back to a word ratio and never loses words", () => {
    const text = "We are creating the visual experiences of the future.";
    const { head, tail } = splitVoice(text);
    expect(`${head} ${tail}`).toBe(text);
    expect(head.length).toBeGreaterThan(0);
    expect(tail.length).toBeGreaterThan(0);
  });

  it("keeps a single word whole", () => {
    expect(splitVoice("Partners")).toEqual({ head: "Partners", tail: "" });
  });
});

describe("sentenceCase", () => {
  it("lowers Turkish capitals with the Turkish locale", () => {
    expect(sentenceCase("BİRLİKTE DAHA İYİYİZ", "tr")).toBe("Birlikte daha iyiyiz");
    expect(sentenceCase("İŞİ BİTİR", "tr")).toBe("İşi bitir");
  });

  it("keeps acronyms", () => {
    expect(sentenceCase("GET SH*T DONE", "en")).toBe("Get sh*t done");
    expect(sentenceCase("AI FIRST STUDIO", "en")).toBe("AI first studio");
  });
});

describe("titleCase", () => {
  it("formats an all-caps name and title", () => {
    expect(titleCase("ZÜHRE DİDEM GÖDEK", "tr")).toBe("Zühre Didem Gödek");
    expect(titleCase("PRESIDENT & CCO", "en")).toBe("President & CCO");
  });
});

describe("pad2", () => {
  it("zero-pads", () => {
    expect(pad2(3)).toBe("03");
    expect(pad2(12)).toBe("12");
  });
});
