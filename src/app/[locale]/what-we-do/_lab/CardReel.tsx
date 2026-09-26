"use client";

import { useEffect, useRef } from "react";
import styles from "./lab.module.css";

/**
 * LAB — kart içi sessiz döngü (AI Creative Production kartı: AI showreel'den
 * altı kesit, 6.4 sn, 480×500, WebM 190 KB / MP4 247 KB).
 *
 * - `preload="none"`, poster = kartın durağan karesi (ilk kareyle aynı).
 * - Yalnız kart görünürken oynar, ekrandan çıkınca durur.
 * - Hareket azaltmada hiç oynamaz: poster kalır.
 * - Dekoratif (`aria-hidden`); kartın erişilebilir adı başlık bağlantısı.
 */
export function CardReel({ poster, webm, mp4 }: { poster: string; webm: string; mp4: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {
            // Otomatik oynatma engellenirse poster kalır.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={styles.cardReel}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
