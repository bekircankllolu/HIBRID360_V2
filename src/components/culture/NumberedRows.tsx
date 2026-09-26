import type { ReactNode } from "react";
import { Reveal } from "@/components/lab/Reveal";
import { pad2, splitVoice } from "./lab-text";
import styles from "./NumberedRows.module.css";

export interface NumberedRow {
  /** Satırın metni; `splitVoice` ile sans baş + serif devam olarak çizilir. */
  text: string;
  /** Sağ sütun (ör. durum etiketi, yıl, bağlantı). */
  aside?: ReactNode;
  /** Metnin altında ek içerik (ör. alt liste). */
  children?: ReactNode;
  lang?: string;
}

/**
 * LAB (monks.com satır listesi, desen 4) — numara | kalın sans + serif
 * devam | isteğe bağlı sağ sütun; 1px çizgilerle ayrılan satırlar.
 *
 * `size="lg"`: kısa iddia cümleleri (Vizyon/Misyon) — büyük punto.
 * `size="md"`: cümle uzunluğunda maddeler — okunur ölçü.
 * `voice={false}`: metin tek seste (uzun cümlelerde ikiye bölmek okumayı bozar).
 */
export function NumberedRows({
  rows,
  size = "md",
  voice = true,
  ordered = true,
  start = 1,
}: {
  rows: readonly NumberedRow[];
  size?: "lg" | "md";
  voice?: boolean;
  ordered?: boolean;
  start?: number;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <List className={`${styles.rows} ${styles[size]}`}>
      {rows.map((row, index) => {
        const { head, tail } = voice ? splitVoice(row.text) : { head: row.text, tail: "" };
        return (
          <Reveal as="li" key={`${row.text}-${index}`} delay={Math.min(index, 5) * 70} className={styles.row}>
            <span className={styles.index} aria-hidden="true">
              {pad2(index + start)}
            </span>
            <div className={styles.main}>
              <p className={styles.text} lang={row.lang}>
                <span className={styles.head}>{head}</span>
                {tail ? <span className={`lab-serif ${styles.tail}`}> {tail}</span> : null}
              </p>
              {row.children}
            </div>
            {row.aside ? <div className={styles.aside}>{row.aside}</div> : null}
          </Reveal>
        );
      })}
    </List>
  );
}
