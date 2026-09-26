import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Work } from "@/types/content";
import { solutionsOf } from "./work-inventory";
import styles from "./WorkCaseCard.module.css";

/** Kartta görünen etiket sayısı; kalanı "+N". */
const VISIBLE_TAGS = 2;

export interface WorkCaseCardProps {
  work: Work;
  client: string;
  title: string;
  moreLabel: (count: number) => string;
}

/**
 * Öne çıkan iş kartı (monks "Popular Cases"): görsel → "Proje · Müşteri"
 * + ok dairesi → ince çizgi → hizmet etiketleri ve "+N".
 *
 * Kartın tamamı tek bağlantı; ok dairesi ve ayraçlar dekoratif.
 */
export function WorkCaseCard({ work, client, title, moreLabel }: WorkCaseCardProps) {
  const solutions = solutionsOf(work);
  const shown = solutions.slice(0, VISIBLE_TAGS);
  const rest = solutions.length - shown.length;

  return (
    <Link href={`/work/${work.slug}`} className={styles.card}>
      <span className={styles.media}>
        {work.cover_image_url ? (
          <Image
            src={work.cover_image_url}
            alt=""
            fill
            sizes="(max-width: 760px) 82vw, 24vw"
            className={styles.image}
            unoptimized
          />
        ) : (
          <span className={styles.monogram} aria-hidden="true">
            {client.slice(0, 2)}
          </span>
        )}
      </span>

      <span className={styles.heading}>
        <span className={styles.title}>
          {title}
          <span className={styles.dot} aria-hidden="true">
            {" · "}
          </span>
          {client}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>

      {solutions.length > 0 && (
        <span className={styles.tags}>
          <span className={styles.tagList}>{shown.join(" · ")}</span>
          {rest > 0 && (
            <span className={styles.more}>
              <span aria-hidden="true">+{rest}</span>
              <span className={styles.srOnly}>{moreLabel(rest)}</span>
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

/** Envanter boşken kartın yerini tutan çerçeve — içerik uydurmaz. */
export function WorkCaseCardSkeleton() {
  return (
    <span className={styles.skeleton} aria-hidden="true">
      <span className={styles.media} />
      <span className={styles.bar} data-w="long" />
      <span className={styles.bar} data-w="short" />
    </span>
  );
}
