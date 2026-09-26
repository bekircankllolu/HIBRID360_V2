"use client";

import { useEffect, useRef } from "react";

/**
 * LAB — kartın arkasındaki dev numara (iki katman).
 *
 * Dış span bir PENCERE: kartın üst çizgisinin 1px üstünde biter
 * (`overflow: hidden`, yüksekliği çağıranın CSS'inde). Numara pencerenin
 * altında kesildiği için kartın yarım piksele düşen üst kenarından siyah
 * bir çizgi sızmaz.
 *
 * İç span kaydırmaya bağlı hareket eder: sayfa aşağı kaydıkça numara
 * kartın arkasına doğru iner, yukarı kaydıkça hafifçe geri çıkar.
 * Hareket ölçülü: `-0.06em → 0.18em`. Görünür değilken dinlemez
 * (IntersectionObserver), kare başına en fazla bir ölçüm (rAF), React
 * state'e yazmaz. Hareket azaltmada sabit durur.
 */
export function ScrollNumber({
  value,
  className,
  innerClassName,
}: {
  value: string;
  className?: string;
  innerClassName?: string;
}) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = outer.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0: öğe ekranın altından giriyor · 1: üstten çıktı.
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      // Numara çoğunlukla tam görünür; kaydırdıkça alt kısmı kartın
      // arkasına iner. Taban çizgisinin pencere kenarından geçtiği an
      // pencere altındaki yumuşak kapanışta (mask) kaybolur.
      const shift = -0.06 + progress * 0.24;
      inner.style.transform = `translate3d(0, ${shift.toFixed(3)}em, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    let listening = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !listening) {
        listening = true;
        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      } else if (!entry?.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    observer.observe(outer);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span ref={outerRef} className={className} aria-hidden="true">
      <span ref={innerRef} className={innerClassName} style={{ display: "block", willChange: "transform" }}>
        {value}
      </span>
    </span>
  );
}
