import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

export type Ground = "paper" | "black" | "yellow" | "pink" | "white";

/**
 * LAB (monks.com sayfa başı) — sol sütunda küçük etiket, sağda dev
 * "konuşan" başlık (dar yüz, 500), altında giriş cümlesi ve eylemler.
 *
 * Başlık `ReactNode`: çağıran `<span className="lab-serif">` ile serif
 * ses, `<Scribble>` ile el çizimi vurgu ekleyebilir. Sayfanın TEK h1'i
 * budur; `titleAs="h2"` yalnız sayfanın h1'i başka yerdeyse.
 */
export function PageIntro({
  rail,
  title,
  lede,
  actions,
  ground = "paper",
  titleAs = "h1",
  titleId,
  children,
}: {
  rail: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  ground?: Ground;
  titleAs?: "h1" | "h2";
  titleId?: string;
  children?: ReactNode;
}) {
  const Title = titleAs;
  return (
    <header className={styles.intro} data-ground={ground}>
      <p className={`lab-rail ${styles.rail}`}>{rail}</p>
      <div className={styles.body}>
        <Title id={titleId} className={`lab-display ${styles.title}`}>
          {title}
        </Title>
        {lede && <p className={styles.lede}>{lede}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
        {children}
      </div>
    </header>
  );
}
