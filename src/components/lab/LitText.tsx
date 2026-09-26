"use client";

import { Fragment, type CSSProperties, type ElementType } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import styles from "./LitText.module.css";

/**
 * LAB (monks.com "Our Agents" başlığı) — kaydırdıkça kelime kelime
 * soluktan koyuya dönen metin.
 *
 * - Görsel kelimeler `aria-hidden`; ekran okuyucu tam cümleyi gizli
 *   kopyadan tek parça okur.
 * - Yalnız opaklık: layout değişmez.
 * - Hareket azaltmada ve JS yokken metin tamamen koyu (`--progress` 1 /
 *   CSS varsayılanı).
 */
export function LitText({
  text,
  as: Tag = "h2",
  className = "",
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const { ref, motion } = useScrollScene<HTMLElement>({ mode: "pass" });
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${styles.lit} ${className}`}
      data-motion={motion}
      style={{ "--n": words.length } as CSSProperties}
    >
      <span className="srOnly">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className={styles.word} style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
