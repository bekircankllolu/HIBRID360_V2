import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Work } from "@/types/content";
import { solutionsOf } from "./work-inventory";
import styles from "./WorkIndexTable.module.css";

export interface WorkIndexLabels {
  client: string;
  project: string;
  solutions: string;
  more: (count: number) => string;
}

export interface WorkIndexRow {
  work: Work;
  client: string;
  title: string;
}

/**
 * Tam genişlik iş dizini (monks "Client | Project | Solutions").
 *
 * Her satır tek bağlantı: sütun başlığı satırı yalnız görsel düzen
 * (ekran okuyucu bağlantı metnini okur: müşteri, proje, ilk hizmet,
 * "N hizmet daha"). `children` boş/eşleşmeyen durum mesajı için.
 */
export function WorkIndexTable({
  rows,
  labels,
  children,
  skeletonRows = 0,
}: {
  rows: readonly WorkIndexRow[];
  labels: WorkIndexLabels;
  children?: ReactNode;
  skeletonRows?: number;
}) {
  return (
    <div className={styles.index}>
      <div className={styles.head} aria-hidden="true">
        <span>{labels.client}</span>
        <span>{labels.project}</span>
        <span>{labels.solutions}</span>
      </div>

      {children}

      {rows.length > 0 && (
        <ul className={styles.list}>
          {rows.map(({ work, client, title }) => {
            const [first, ...rest] = solutionsOf(work);
            return (
              <li key={work.id}>
                <Link href={`/work/${work.slug}`} className={styles.row}>
                  <span className={styles.client}>{client}</span>
                  <span className={styles.project}>{title}</span>
                  <span className={styles.solutions}>
                    <span className={styles.solution}>{first}</span>
                    {rest.length > 0 && (
                      <span className={styles.more}>
                        <span aria-hidden="true">+{rest.length}</span>
                        <span className={styles.srOnly}>{labels.more(rest.length)}</span>
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {skeletonRows > 0 && (
        <div className={styles.skeleton} aria-hidden="true">
          {Array.from({ length: skeletonRows }, (_, index) => (
            <span key={index} className={styles.skeletonRow} style={{ "--i": index } as React.CSSProperties}>
              <span />
              <span />
              <span />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
