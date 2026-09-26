"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

/**
 * LAB (monks giriş hareketi) — içerik görünür alana girince hafifçe
 * yükselerek belirir, bir kez.
 *
 * Sunucu çıktısı ve JS'siz görünüm TAMAMEN GÖRÜNÜR: gizleme yalnız
 * istemcide, eleman ilk ölçümde ekranın altındaysa uygulanır (ilk ekrandaki
 * içerik hiç saklanmaz, LCP'yi geciktirmez). Hareket azaltmada gizleme yok.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "pre" | "in">("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setState("pre");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Element = Tag as "div";
  return (
    <Element
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${styles.reveal} ${className}`}
      data-reveal={state}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Element>
  );
}
