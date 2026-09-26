import type { ReactNode } from "react";
import type { Ground } from "@/components/lab/PageIntro";
import { Section } from "@/components/lab/Section";
import styles from "./lab.module.css";

/**
 * LAB (monks.com desen 12) — sayfaya özgü kapanış: sol etiket, dev
 * "konuşan" başlık, altında köşeli buton(lar).
 *
 * Sarı sayfa sonu çağrısını layout'taki global CtaBand çiziyor; bu blok
 * onun ÜSTÜNDE sayfanın kendi son sözü için (zemin sarı OLMAMALI, iki sarı
 * bant üst üste gelir).
 */
export function ClosingCall({
  id,
  rail,
  title,
  lede,
  actions,
  lang,
  ground,
}: {
  ground: Exclude<Ground, "yellow">;
  id: string;
  rail: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions: ReactNode;
  lang?: string;
}) {
  return (
    <Section ground={ground} rail={rail} labelledBy={id} className={styles.closing}>
      <div lang={lang}>
        <h2 id={id} className={`lab-display ${styles.closingTitle}`}>
          {title}
        </h2>
        {lede && <p className={styles.closingLede}>{lede}</p>}
      </div>
      <div className={styles.actions}>{actions}</div>
    </Section>
  );
}
