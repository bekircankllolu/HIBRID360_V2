import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getInsightCategory, getInsightTitle } from "@/lib/insights";
import { getInsightVisual } from "@/data/insight-visuals";
import { EditorialImage } from "@/components/insights/EditorialImage";
import { TextFadeIn } from "@/components/ui/TextFadeIn";
import type { InsightsPost } from "@/types/content";
import styles from "./InsightsList.module.css";

/** Kartların görsel oranı ve `sizes` ipucu — monks "Our Expertise" asimetrisi. */
const SLOTS = [
  { shape: "wide", sizes: "(max-width: 760px) 100vw, 36vw" },
  { shape: "square", sizes: "(max-width: 760px) 50vw, 16vw" },
  { shape: "tall", sizes: "(max-width: 760px) 50vw, 24vw" },
] as const;

/**
 * LAB (monks "Our Expertise") — üç öne çıkan yazı, asimetrik dizi:
 * geniş · küçük kare · orta kare, aralarında bol boşluk. Her kart tek
 * bağlantı; görsel yazının tonunda (mint/pembe/lila) bir zemine oturur.
 */
export function InsightFeatured({
  posts,
  locale,
  animateTitles,
}: {
  posts: InsightsPost[];
  locale: Locale;
  animateTitles: boolean;
}) {
  const t = useTranslations("lab.insights");

  return (
    <section className={styles.featured} aria-labelledby="insights-featured-heading">
      <h2 id="insights-featured-heading" className={`lab-h2 ${styles.sectionHeading}`}>
        {t("featuredHeading")}
      </h2>
      <ul className={styles.featuredGrid}>
        {posts.map((post, index) => {
          const slot = SLOTS[index % SLOTS.length];
          const visual = getInsightVisual(post, locale);
          const title = getInsightTitle(post, locale);
          const category = getInsightCategory(post, locale);

          return (
            <li key={post.id} className={styles.card} data-slot={slot.shape} data-reveal-row>
              <Link href={`/think-and-thank/${post.slug}`} className={styles.cardLink}>
                <span className={styles.cardVisual} data-tone={visual.tone}>
                  {/* Görsel illüstratif; bağlantının adı başlıktan gelir. */}
                  <EditorialImage src={visual.src} alt="" sizes={slot.sizes} />
                </span>
                {category && <span className={styles.cardCategory}>{category}</span>}
                <h3 className={styles.cardTitle}>
                  {animateTitles ? <TextFadeIn className={styles.cardTitleText}>{title}</TextFadeIn> : title}
                  <span className={styles.cardArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </h3>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
