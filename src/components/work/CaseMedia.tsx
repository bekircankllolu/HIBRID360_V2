"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./CaseMedia.module.css";

/**
 * LAB (monks vaka sayfası) — başlığın altında, siyah zeminde tam genişlik
 * film/görsel bloğu.
 *
 * Doğrudan video dosyası varsa: `poster` + `preload="none"`, sessiz döngü,
 * YALNIZ görünürken oynar (ekrandan çıkınca durur). Hareket azaltmada hiç
 * oynamaz — poster kalır. Ses yok (otomatik ses yasağı). Görsel yoksa
 * bileşen hiç çizilmez; çağıran karar verir.
 */
export function CaseMedia({
  cover,
  video,
  label,
}: {
  cover: string | null;
  video: string | null;
  /** Görselin/filmin erişilebilir adı (proje · müşteri). */
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const element = videoRef.current;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.play().catch(() => {
            // Otomatik oynatma engellenirse poster kalır — sessiz geç.
          });
        } else {
          element.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className={styles.media}>
      {video ? (
        <video
          ref={videoRef}
          className={styles.fill}
          src={video}
          poster={cover ?? undefined}
          preload="none"
          muted
          loop
          playsInline
          aria-label={label}
        />
      ) : cover ? (
        <Image
          src={cover}
          alt={label}
          fill
          priority
          sizes="(max-width: 760px) 100vw, 92vw"
          className={styles.fill}
          unoptimized
        />
      ) : null}
    </div>
  );
}
