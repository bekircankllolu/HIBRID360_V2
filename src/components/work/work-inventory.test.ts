import { describe, expect, it } from "vitest";
import type { Work } from "@/types/content";
import {
  ALL,
  EMPTY_FILTERS,
  activeFilterCount,
  filterWorks,
  pickFeatured,
  solutionsOf,
  workTitle,
  yearsOf,
} from "./work-inventory";

/** Test fikstürü — yalnız mantık için; sitede gösterilmez. */
function work(overrides: Partial<Work>): Work {
  return {
    id: "id",
    slug: "slug",
    title_tr: null,
    title_en: null,
    client_name: null,
    client_name_confidential: false,
    year: 2025,
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
    ...overrides,
  };
}

describe("solutionsOf", () => {
  it("hizmet → format → sektör sırası, boş ve yinelenen atılır", () => {
    expect(solutionsOf(work({ service: "Production", content_format: "Film", industry: "Retail" }))).toEqual([
      "Production",
      "Film",
      "Retail",
    ]);
    expect(solutionsOf(work({ service: "AI", content_format: "AI" }))).toEqual(["AI"]);
    expect(solutionsOf(work({}))).toEqual([]);
  });
});

describe("filterWorks", () => {
  const works = [
    work({ id: "a", year: 2025, service: "Production", industry: "Retail" }),
    work({ id: "b", year: 2024, service: "Digital", industry: "Retail" }),
    work({ id: "c", year: 2024, service: "Production", industry: "Energy" }),
  ];

  it("filtre yokken hepsi", () => {
    expect(filterWorks(works, EMPTY_FILTERS)).toHaveLength(3);
  });

  it("yıl + hizmet birlikte daraltır", () => {
    const ids = filterWorks(works, { year: "2024", service: "Production", industry: ALL }).map((w) => w.id);
    expect(ids).toEqual(["c"]);
  });

  it("etkin filtre sayısı", () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(activeFilterCount({ year: "2024", service: ALL, industry: "Retail" })).toBe(2);
  });

  it("yıllar yeniden eskiye, tekil", () => {
    expect(yearsOf(works)).toEqual([2025, 2024]);
  });
});

describe("pickFeatured", () => {
  it("işaretli işler varsa yalnız onlar (en çok 3)", () => {
    const works = ["a", "b", "c", "d", "e"].map((id, i) => work({ id, is_featured: i !== 1 }));
    const result = pickFeatured(works);
    expect(result.curated).toBe(true);
    expect(result.works.map((w) => w.id)).toEqual(["a", "c", "d"]);
  });

  it("işaretli yoksa en yeni 3 iş, curated=false", () => {
    const works = ["a", "b", "c", "d"].map((id) => work({ id }));
    const result = pickFeatured(works);
    expect(result.curated).toBe(false);
    expect(result.works).toHaveLength(3);
  });
});

describe("workTitle", () => {
  it("locale başlığı, yoksa diğer dil, yoksa format/hizmet, yoksa yedek", () => {
    expect(workTitle(work({ title_tr: "TR", title_en: "EN" }), "tr", "x")).toBe("TR");
    expect(workTitle(work({ title_en: "EN" }), "tr", "x")).toBe("EN");
    expect(workTitle(work({ service: "Digital" }), "en", "x")).toBe("Digital");
    expect(workTitle(work({}), "en", "x")).toBe("x");
  });
});
