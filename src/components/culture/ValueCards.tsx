import { Reveal } from "@/components/lab/Reveal";
import { pad2 } from "./lab-text";
import styles from "./ValueCards.module.css";

export interface ValueCard {
  title: string;
  body: string;
  /** Başlığın dili (ör. TR sayfada İngilizce kalan değer adları). */
  titleLang?: string;
}

/**
 * LAB (monks.com Careers "Our Values" + kademeli kart ızgarası, desen 2) —
 * değer kartları. Kartların arkasında yarısı görünen dev DOLU numaralar;
 * geniş ekranda çift sütunlar aşağıda durur (kademe). Numara dekoratif
 * (`aria-hidden`), sıra zaten `<ol>`'da.
 */
export function ValueCards({ items, columns = 3 }: { items: readonly ValueCard[]; columns?: 3 | 2 }) {
  return (
    <ol className={`${styles.grid} ${columns === 2 ? styles.two : styles.three}`}>
      {items.map((item, index) => (
        <Reveal as="li" key={item.title} delay={(index % columns) * 90} className={styles.cell}>
          <span className={styles.number} aria-hidden="true">
            {pad2(index + 1)}
          </span>
          <article className={styles.card}>
            <h3 className={`lab-h3 ${styles.title}`} lang={item.titleLang}>
              {item.title}
            </h3>
            <p className={styles.body}>{item.body}</p>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
