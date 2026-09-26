"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useScrollScene } from "@/hooks/useScrollScene";
import { Scribble } from "./Scribble";
import styles from "./HibridZero.module.css";

/**
 * LAB — "Hibrid 36●" sahnesi (monks.com `c11c-monk-quote` uyarlaması).
 *
 * monks'ta dairesel portre videosu "monk" kelimesindeki "o"nun yerini
 * alıyor. Bizde "360"taki "0" dairesel video: üç portre, 3 sn döngü
 * (showreel 28-33 sn kesiti, 480 px kare, WebM 34 KB / MP4 60 KB).
 *
 * Kaydırma zaman çizelgesi (tek `--progress`, CSS'te türetilir):
 *   0.00-0.25  fuşya-açık daire ortadan büyür, ekranı kaplar
 *   0.10-0.90  "Hibrid 360" satırı yatayda kayar
 *   0.80-1.00  blok hafifçe eğilerek kalkar, daire kapanır
 *
 * Kurallar: marka yazımı "Hibrid 360" (büyük H, küçük harf dönüşümü yok);
 * yan kelimeler konturlu DEĞİL, dolu fuşya ton (typography-taste kuralı);
 * fuşya-açık zeminde metin siyah (kontrast kuralı); hareket azaltmada sahne
 * açık ve sabit, video oynamaz (yalnız poster).
 */
export function HibridZero() {
  const t = useTranslations("lab.hibridZero");
  const { ref, motion } = useScrollScene<HTMLDivElement>({ mode: "sticky", rootMargin: "20% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video yalnız sahne görünürken oynar; hareket azaltmada hiç oynamaz.
  useEffect(() => {
    const scene = ref.current;
    const video = videoRef.current;
    if (!scene || !video || motion === "static") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        video.play().catch(() => {
          // Otomatik oynatma engellenirse poster kalır — sessiz geç.
        });
      } else {
        video.pause();
      }
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [ref, motion]);

  const side = "Hibrid 360 Hibrid 360 Hibrid 360";

  return (
    <section className={styles.section} aria-labelledby="hibrid-zero-title">
      <div ref={ref} className={styles.wrapper} data-motion={motion}>
        <div className={styles.sticky}>
          <div className={styles.disc}>
            <div className={styles.stage}>
              <div className={styles.line}>
                <span className={styles.side} aria-hidden="true">
                  {side}
                </span>
                <h2 id="hibrid-zero-title" className={styles.word} lang="en">
                  <span className="srOnly">Hibrid 360</span>
                  <span aria-hidden="true">Hibrid 36</span>
                  <span className={styles.zero} aria-hidden="true">
                    <video
                      ref={videoRef}
                      className={styles.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster="/videos/lab/hibrid-zero-faces-poster.webp"
                    >
                      <source src="/videos/lab/hibrid-zero-faces.webm" type="video/webm" />
                      <source src="/videos/lab/hibrid-zero-faces.mp4" type="video/mp4" />
                    </video>
                  </span>
                </h2>
                <span className={styles.side} aria-hidden="true">
                  {side}
                </span>
              </div>

              <div className={styles.caption}>
                <span className={styles.meet}>
                  <Scribble shape="circle" tone="ink" delay={250}>
                    {t("meet")}
                  </Scribble>
                </span>
                <p className={styles.text}>{t("caption")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
