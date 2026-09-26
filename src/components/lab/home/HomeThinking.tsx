import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { insightsPosts } from "@/data/insights";
import type { Locale } from "@/i18n/routing";
import { getInsightCategory, getInsightTitle } from "@/lib/insights";
import { Button } from "@/components/ui/Button";
import { Reveal } from "../Reveal";
import styles from "./HomeThinking.module.css";

/**
 * Başlığı monks'un iki sesli satırı için ikiye böler: ilk cümle/iki nokta
 * öncesi kalın sans, devamı serif. Bölünemiyorsa tek ses.
 */
function splitTitle(title: string): [string, string] {
  const match = title.match(/^(.+?[:?.!])\s+(.+)$/);
  return match ? [match[1], match[2]] : [title, ""];
}

/** LAB (monks "On our minds") — Think & Thank'ten son dört yazı, satır düzeninde. */
export function HomeThinking({ locale }: { locale: Locale }) {
  const t = useTranslations("lab.home");
  const posts = insightsPosts.filter((post) => post.is_published !== false).slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section className={styles.section} data-ground="paper" aria-labelledby="home-thinking-title">
      <div className={styles.head}>
        <p className="lab-rail" lang="en">
          {t("thinkingRail")}
        </p>
        <h2 id="home-thinking-title" className={`lab-h2 ${styles.title}`}>
          {t("thinkingTitle")}
        </h2>
      </div>

      <ul className={styles.list}>
        {posts.map((post, index) => {
          const [lead, rest] = splitTitle(getInsightTitle(post, locale));
          const href = `/think-and-thank/${post.slug}`;
          return (
            <Reveal as="li" key={post.slug} delay={index * 70} className={styles.row}>
              <span className={`lab-meta ${styles.category}`}>{getInsightCategory(post, locale)}</span>
              <p className={styles.heading}>
                <span className={styles.lead}>{lead}</span>
                {rest && <span className={`lab-serif ${styles.rest}`}> {rest}</span>}
              </p>
              {post.read_time_minutes ? (
                <span className={`lab-meta ${styles.time}`}>
                  {t.rich("readTime", {
                    minutes: post.read_time_minutes,
                    b: (chunks) => <b>{chunks}</b>,
                  })}
                </span>
              ) : (
                <span />
              )}
              <Link href={href} className={styles.cta} aria-label={`${t("readNow")}: ${lead} ${rest}`.trim()}>
                <span className={styles.ctaLabel}>{t("readNow")}</span>
                <span className={styles.ctaArrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      <div className={styles.more}>
        <Button href="/think-and-thank" variant="ghost" size="sm" lang={locale}>
          {t("allPosts")}
        </Button>
      </div>
    </section>
  );
}
