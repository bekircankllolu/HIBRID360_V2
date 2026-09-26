"use client";

import { useEffect, useRef } from "react";

export interface LoopVideoSource {
  src: string;
  type: string;
}

/**
 * LAB (monks.com karanlık video zemini) — sessiz, dekoratif arka plan döngüsü.
 *
 * - `preload="none"` + poster: video yalnız görünür alana girince indirilir
 *   ve oynar, çıkınca durur (performans bütçesi).
 * - Hareket azaltmada hiç oynatılmaz; poster kare kalır.
 * - Dekoratif: `aria-hidden`, kontrol yok, ses yok (`muted`).
 */
export function LoopVideo({
  sources,
  poster,
  className = "",
}: {
  sources: readonly LoopVideoSource[];
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {
            /* Otomatik oynatma reddedildi: poster kalır, sorun değil. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
