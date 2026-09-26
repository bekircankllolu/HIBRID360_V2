"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Scribble.module.css";

/**
 * LAB (monks.com `m27-scribble` karşılığı) — el çizimi vurgu.
 *
 * Sarılan kelimenin etrafına görünür alana girince kalemle çizilmiş gibi
 * bir halka ya da altına bir çizgi çekilir. Metin değil ÇİZGİ: konturlu
 * yazı kuralını ilgilendirmez (typography-taste).
 *
 * - Çizim bir kez olur (IntersectionObserver, sonra bağlantı kesilir).
 * - `pathLength="1"` ile dash değerleri şekilden bağımsız 0..1.
 * - Hareket azaltmada globals.css geçişleri 0.01ms'e indirir: çizgi
 *   anında tam görünür, hareket yok.
 * - SVG `aria-hidden`: ekran okuyucu yalnız kelimeyi okur.
 */

export type ScribbleShape = "circle" | "underline";
export type ScribbleTone = "fuchsia" | "yellow" | "ink" | "current";

const PATHS: Record<ScribbleShape, string> = {
  // Başladığı yeri geçip biraz üstüne binen, eğik ve eşit olmayan bir halka.
  circle:
    "M 44 14 C 96 1, 178 5, 193 33 C 206 60, 132 79, 70 75 C 22 72, -2 55, 9 34 C 20 13, 76 5, 150 9",
  // Hafif dalgalı, sağa doğru yükselen tek çizgi + kısa ikinci vuruş.
  underline: "M 3 60 C 48 52, 118 56, 197 47 M 36 72 C 80 67, 126 68, 168 64",
};

interface ScribbleProps {
  children: ReactNode;
  shape?: ScribbleShape;
  tone?: ScribbleTone;
  /** Çizimin gecikmesi (ms) — aynı ekranda birden çok vurgu sırayla gelsin. */
  delay?: number;
}

export function Scribble({ children, shape = "circle", tone = "fuchsia", delay = 0 }: ScribbleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`${styles.scribble} ${styles[shape]} ${styles[tone]}`}
      data-drawn={drawn ? "" : undefined}
      style={{ "--scribble-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
      <svg className={styles.mark} viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={PATHS[shape]} pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/** Serbest duran el çizimi ok (etiketten içeriğe işaret eder). */
export function ScribbleArrow({ tone = "current", className = "" }: { tone?: ScribbleTone; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setDrawn(true);
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={`${styles.arrowMark} ${styles[tone]} ${className}`}
      data-drawn={drawn ? "" : undefined}
      viewBox="0 0 64 48"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M 4 6 C 22 4, 44 12, 54 38" pathLength={1} />
      <path d="M 40 32 C 46 36, 51 39, 55 40 C 56 34, 58 29, 61 25" pathLength={1} />
    </svg>
  );
}
