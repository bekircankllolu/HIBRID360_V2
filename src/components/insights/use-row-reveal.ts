"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LAB (monks "On our minds") — liste satırları kaydırdıkça sırayla belirir.
 *
 * - Sunucu render'ında ve JS yokken her satır görünür: gizleme yalnız
 *   `armed` true olduktan (hydration sonrası) CSS'te devreye girer.
 * - Aynı gözlemci turunda ekrana giren satırlar `--reveal-order` ile
 *   kademelenir (monks'taki gibi yukarıdan aşağı dalga).
 * - Bir kez belirir, geri kaydırınca sönmez — okunacak liste, gösteri değil.
 * - Hareket azaltmada CSS gizli durumu hiç tanımlamıyor; burada ek dal yok.
 * - `resetKey` değişince (kategori filtresi) yeni satırlar yeniden gözlenir.
 */
export function useRowReveal<T extends HTMLElement>(resetKey: string) {
  const containerRef = useRef<T>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const rows = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal-row]"));
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const row = entry.target as HTMLElement;
          row.style.setProperty("--reveal-order", String(order));
          row.dataset.revealed = "";
          order += 1;
          observer.unobserve(row);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const row of rows) {
      if (row.dataset.revealed === undefined) observer.observe(row);
    }

    return () => observer.disconnect();
  }, [resetKey]);

  return { containerRef, armed };
}
