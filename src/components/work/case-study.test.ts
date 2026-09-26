import { describe, expect, it } from "vitest";
import type { Work } from "@/types/content";
import { isDirectVideo, nextWorkOf } from "./case-study";

const work = (slug: string): Work => ({
  id: slug,
  slug,
  title_tr: null,
  title_en: null,
  client_name: null,
  client_name_confidential: false,
  year: 2026,
  format: "video",
  category: null,
  service: null,
  industry: null,
  content_format: null,
  is_featured: false,
  cover_image_url: null,
  video_url: null,
  case_problem_tr: null,
  case_problem_en: null,
  case_solution_tr: null,
  case_solution_en: null,
  case_result_tr: null,
  case_result_en: null,
  director_id: null,
});

describe("isDirectVideo", () => {
  it("accepts direct video files, with or without a query string", () => {
    expect(isDirectVideo("https://cdn.example.com/a/film.mp4")).toBe(true);
    expect(isDirectVideo("/videos/film.WEBM?v=2")).toBe(true);
  });

  it("rejects embeds, empty values and non-video files", () => {
    expect(isDirectVideo("https://vimeo.com/123456")).toBe(false);
    expect(isDirectVideo("https://www.youtube.com/watch?v=abc")).toBe(false);
    expect(isDirectVideo("/images/poster.webp")).toBe(false);
    expect(isDirectVideo(null)).toBe(false);
    expect(isDirectVideo("")).toBe(false);
  });
});

describe("nextWorkOf", () => {
  const works = [work("a"), work("b"), work("c")];

  it("returns the following case and wraps around at the end", () => {
    expect(nextWorkOf(works, "a")?.slug).toBe("b");
    expect(nextWorkOf(works, "c")?.slug).toBe("a");
  });

  it("has no next case for a single work or an unknown slug", () => {
    expect(nextWorkOf([work("a")], "a")).toBeNull();
    expect(nextWorkOf(works, "missing")).toBeNull();
    expect(nextWorkOf([], "a")).toBeNull();
  });
});
