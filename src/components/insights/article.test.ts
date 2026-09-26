import { describe, expect, it } from "vitest";
import posts from "@/data/insights-posts.json";
import { pullQuoteOf, relatedPostsOf } from "./article";

describe("pullQuoteOf", () => {
  it("quotes the last sentence of the last paragraph", () => {
    expect(
      pullQuoteOf([
        "İlk paragraf.",
        "Sonuçta bir pusula çıkar. Büyük fikir, havadan gelmez: doğru stratejinin içinden büyür.",
      ]),
    ).toBe("Büyük fikir, havadan gelmez: doğru stratejinin içinden büyür.");
  });

  it("does not quote single-paragraph articles or unsuitable sentences", () => {
    expect(pullQuoteOf(["Tek paragraf, tek cümle ve yeterince uzun bir iddia."])).toBeNull();
    expect(pullQuoteOf(["Bir.", "Kısa."])).toBeNull();
    expect(pullQuoteOf(["Bir.", `${"uzun ".repeat(50)}cümle.`])).toBeNull();
    expect(pullQuoteOf([])).toBeNull();
  });

  it("only ever returns text that exists in the article body", () => {
    for (const post of posts) {
      for (const body of [post.body_tr, post.body_en]) {
        const paragraphs = (body ?? "").split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
        const quote = pullQuoteOf(paragraphs);
        if (quote) expect(body).toContain(quote);
      }
    }
  });
});

describe("relatedPostsOf", () => {
  const list = ["a", "b", "c", "d"].map((slug) => ({ slug }));

  it("returns the following posts and wraps around", () => {
    expect(relatedPostsOf(list, "b").map((p) => p.slug)).toEqual(["c", "d", "a"]);
    expect(relatedPostsOf(list, "d", 2).map((p) => p.slug)).toEqual(["a", "b"]);
  });

  it("never includes the current post and caps at what exists", () => {
    expect(relatedPostsOf([{ slug: "a" }, { slug: "b" }], "a").map((p) => p.slug)).toEqual(["b"]);
    expect(relatedPostsOf([{ slug: "a" }], "a")).toEqual([]);
    expect(relatedPostsOf([], "a")).toEqual([]);
  });

  it("falls back to the first posts for an unknown slug", () => {
    expect(relatedPostsOf(list, "x", 2).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});
