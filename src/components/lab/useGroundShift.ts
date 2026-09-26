"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LAB (monks.com `data-background-color`) — bölüm ekrana oturunca zemin
 * rengini değiştirir.
 *
 * monks'ta her bölüm kendi zemin rengini bildiriyor ve sayfa o bölüme
 * gelince zemine yumuşak geçiş yapıyor. Burada JS yalnız bir bayrak
 * yazar (`data-grounded`); renklerin hepsi bölümün CSS'inde, geçiş de
 * CSS `transition` ile. Kontrast kuralı CSS'te: sarı/fuşya zeminde metin
 * siyah — geçiş zemin ve metin için aynı süre ve eğriyle yapılır.
 *
 * Eşik %45 görünürlük: bölüm ekranın ortasına gelmeden renk değişmez,
 * kısa bir göz atmada sayfa yanıp sönmez. Hareket azaltmada da çalışır
 * (renk değişimi hareket değildir; globals.css geçiş süresini sıfırlar).
 */
export function useGroundShift<T extends HTMLElement>(threshold = 0.45) {
  const ref = useRef<T>(null);
  const [grounded, setGrounded] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setGrounded(Boolean(entry?.isIntersecting && entry.intersectionRatio >= threshold)),
      { threshold: [0, threshold, 1] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, grounded };
}
