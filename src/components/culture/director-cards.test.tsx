// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import type { Director } from "@/types/content";

// Yönlendirme bağlamı olmadan render: locale önekli Link yerine düz <a>.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const { DirectorCards, initialsOf } = await import("./DirectorCards");

const BASE: Director = {
  id: "d1",
  slug: "ayse-demir",
  full_name: "Ayşe Nur Demir",
  role: "Director",
  one_liner_tr: "Belgesel dilinde reklam filmleri.",
  one_liner_en: "Commercials in a documentary language.",
  bio_tr: null,
  bio_en: null,
  reel_video_url: null,
  photo_url: null,
  city: "İstanbul",
  languages: ["tr", "en"],
  relationship_type: "staff",
  is_published: true,
  sort_order: 1,
};

function render(directors: Director[], locale: "tr" | "en" = "tr") {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<DirectorCards directors={directors} locale={locale} />);
  return host;
}

describe("initialsOf", () => {
  it("uses first and last name initials with locale-aware casing", () => {
    expect(initialsOf("Ayşe Nur Demir", "tr")).toBe("AD");
    expect(initialsOf("ilker", "tr")).toBe("İ");
    expect(initialsOf("  ", "tr")).toBe("");
  });
});

describe("DirectorCards", () => {
  it("links each card to the profile and shows the localized one-liner", () => {
    const host = render([BASE], "en");
    const link = host.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/culture/directors/ayse-demir");
    expect(link?.textContent).toContain("Ayşe Nur Demir");
    expect(link?.textContent).toContain("Commercials in a documentary language.");
  });

  it("renders a typographic face, not an empty frame or fake photo, when the portrait is missing", () => {
    const host = render([BASE]);
    expect(host.querySelector("img")).toBeNull();
    expect(host.textContent).toContain("AD");
  });

  it("renders the delivered portrait as a decorative image (the name labels the link)", () => {
    const host = render([{ ...BASE, photo_url: "/images/directors/ayse.webp" }]);
    const img = host.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/images/directors/ayse.webp");
    expect(img?.getAttribute("alt")).toBe("");
    expect(img?.getAttribute("loading")).toBe("lazy");
  });
});
