"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/EmptyState";
import type { Locale } from "@/i18n/routing";
import { getInsightCategory } from "@/lib/insights";
import type { InsightsPost } from "@/types/content";
import { InsightFeatured } from "./InsightFeatured";
import { InsightRow } from "./InsightRow";
import { useRowReveal } from "./use-row-reveal";
import styles from "./InsightsList.module.css";

/** "Tümü" görünümünde üstte asimetrik kartlarla gösterilen yazı sayısı. */
const FEATURED_COUNT = 3;
const ALL = "all";

/**
 * Think & Thank yazı dizini — LAB (monks.com "On our minds" düzeni).
 *
 * "Tümü"nde ilk üç yazı öne çıkan kart, kalanı satır; bir kategori
 * seçilince kartlar kalkar ve yalnız o kategorinin satırları kalır. Her
 * yazı sayfada TAM BİR kez bağlantı olur (kart ya da satır) — e2e
 * `think-and-thank.spec.ts` 19 bağlantı bekliyor.
 */
export function InsightsList({
  posts,
  locale,
  animateTitles = false,
}: {
  posts: InsightsPost[];
  locale: Locale;
  animateTitles?: boolean;
}) {
  const t = useTranslations("insights");
  const tLab = useTranslations("lab.insights");
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const { containerRef, armed } = useRowReveal<HTMLDivElement>(activeCategory);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.category).filter((c): c is string => Boolean(c))),
      ),
    [posts],
  );

  const categoryLabels = useMemo(
    () =>
      new Map(
        categories.map((category) => {
          const post = posts.find((candidate) => candidate.category === category);
          return [category, post ? getInsightCategory(post, locale) ?? category : category];
        }),
      ),
    [categories, locale, posts],
  );

  const filteredPosts = useMemo(
    () =>
      activeCategory === ALL
        ? posts
        : posts.filter((post) => post.category === activeCategory),
    [posts, activeCategory],
  );

  if (posts.length === 0) {
    return <EmptyState message={t("comingSoon")} />;
  }

  const showFeatured = activeCategory === ALL && posts.length > FEATURED_COUNT;
  const featuredPosts = showFeatured ? filteredPosts.slice(0, FEATURED_COUNT) : [];
  const rowPosts = showFeatured ? filteredPosts.slice(FEATURED_COUNT) : filteredPosts;

  return (
    <div
      ref={containerRef}
      className={styles.index}
      data-ground="paper"
      data-armed={armed ? "" : undefined}
    >
      <div className={styles.toolbar}>
        <p className={styles.resultCount} aria-live="polite">
          {t("articleCount", { count: filteredPosts.length })}
        </p>
        {categories.length > 1 && (
          <label className={styles.categoryControl}>
            <span>{t("categoryLabel")}</span>
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
            >
              <option value={ALL}>{t("categoryAll")}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels.get(category)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {showFeatured && (
        <InsightFeatured posts={featuredPosts} locale={locale} animateTitles={animateTitles} />
      )}

      {filteredPosts.length === 0 ? (
        <EmptyState message={t("comingSoon")} />
      ) : (
        <section className={styles.list} aria-labelledby="insights-list-heading">
          <h2 id="insights-list-heading" className={`lab-h2 ${styles.sectionHeading}`}>
            {activeCategory === ALL ? tLab("listHeading") : categoryLabels.get(activeCategory)}
          </h2>
          <ol className={styles.rows}>
            {rowPosts.map((post) => (
              <InsightRow key={post.id} post={post} locale={locale} />
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
