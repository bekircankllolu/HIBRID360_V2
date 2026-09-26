import type { ReactNode } from "react";
import type { Ground } from "./PageIntro";
import styles from "./Section.module.css";

/**
 * LAB (monks.com ızgarası) — sol sütunda küçük etiket (rail), sağda içerik.
 * `wide`: içerik rail sütununu da kaplar (tam genişlik liste/ızgara);
 * etiket o zaman içeriğin üstünde durur. `ground` bölümün zemini.
 */
export function Section({
  rail,
  children,
  ground,
  wide = false,
  tight = false,
  id,
  labelledBy,
  className = "",
}: {
  rail?: ReactNode;
  children: ReactNode;
  ground?: Ground;
  wide?: boolean;
  tight?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-ground={ground}
      className={`${styles.section} ${wide ? styles.wide : ""} ${tight ? styles.tight : ""} ${className}`}
    >
      {rail && <p className={`lab-rail ${styles.rail}`}>{rail}</p>}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
