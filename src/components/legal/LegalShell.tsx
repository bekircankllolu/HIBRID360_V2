import type { ReactNode } from "react";
import styles from "./LegalShell.module.css";

/**
 * LAB (monks.com policy sayfaları) — yasal/kurumsal metinlerin ortak
 * editoryal iskeleti. Kağıt zemin; sayfa başında sol rail'de "Yasal" +
 * güncelleme tarihi, sağda dev dar başlık (sayfanın TEK h1'i) ve alt başlık.
 * Altında iki sütun: solda yapışkan "Bu sayfada" içindekiler (yalnız
 * masaüstü, ≥2 başlık varsa), sağda ~68ch gövde.
 *
 * Gövde `children`: çağıran düz, anlamsal HTML basar (h2, p, ul, table);
 * tipografi `.doc` altındaki eleman seçicileriyle tek yerde yaşar.
 * Böylece PolicyPage blokları ve Erişilebilirlik Beyanı aynı dili konuşur.
 */

export interface LegalTocItem {
  id: string;
  label: string;
}

export function LegalShell({
  rail,
  updated,
  title,
  subtitle,
  toc = [],
  tocLabel,
  children,
}: {
  rail: string;
  /** Güncelleme satırı — dokümanın kendi metni ("Son Güncelleme: …"). */
  updated?: string;
  title: string;
  subtitle?: string;
  toc?: readonly LegalTocItem[];
  tocLabel: string;
  children: ReactNode;
}) {
  const hasToc = toc.length > 1;

  return (
    <div className={styles.page} data-ground="paper">
      <header className={styles.head}>
        <div className={styles.rail}>
          <p className="lab-rail">{rail}</p>
          {updated ? <p className={`lab-meta ${styles.updated}`}>{updated}</p> : null}
        </div>
        <div className={styles.headBody}>
          <h1 className={`lab-display ${styles.title}`}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </header>

      <div className={styles.layout}>
        {hasToc ? (
          <nav className={styles.toc} aria-labelledby="legal-toc-title">
            <p id="legal-toc-title" className={`lab-rail ${styles.tocTitle}`}>
              {tocLabel}
            </p>
            <ol className={styles.tocList}>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.tocLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          <div aria-hidden="true" />
        )}

        <article className={styles.doc}>{children}</article>
      </div>
    </div>
  );
}
