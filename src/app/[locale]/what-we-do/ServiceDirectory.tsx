"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { ScribbleArrow } from "@/components/lab/Scribble";
import { MonaShard } from "@/components/mona/MonaShard";
import { Link } from "@/i18n/navigation";
import styles from "./ServiceDirectory.module.css";

export interface ServiceDirectoryItem {
  id: string;
  name: string;
  href: string;
  description: string;
  image?: {
    src: string;
    alt: string;
    focus: string;
  };
}

/**
 * LAB (monks.com "Your trusted partner…" kart dili) — What We Do hizmet
 * ızgarası.
 *
 * - Kağıt zemin (`data-ground="paper"` çağırandan); renkler anlamsal
 *   değişkenlerden, AI kartının posteri kendi siyah zemininde.
 * - Kart etiketi (derece "045°") kalktı: numara zaten kartın arkasında.
 * - Sol etiket sütunu + el çizimi vurgulu başlık (başlık çağırandan gelir).
 * - Kartlar kademeli: çift sıradaki kartlar aşağıda (CSS `nth-child(even)`;
 *   4 ve 2 sütunda da çift sütuna denk gelir, ritim satırlar boyunca sürer).
 * - Her kartın arkasında dev, DOLU numara (konturlu yazı yok); görsel
 *   numaranın alt yarısını örter.
 * - Bağlantı yalnız hizmet adında (ekran okuyucu kısa ad duyar), `::after`
 *   ile bütün karta yayılır — kart her yerinden tıklanır.
 * - Görünür alana girişte hafif yükselme; JS yoksa ya da hareket azaltmada
 *   kartlar baştan görünür (gizleme yalnız `data-armed` varken).
 * - AI Creative Production'ın fotoğrafı yok: tipografik poster; masaüstünde
 *   kartın üzerinde kalınınca MONA (tek WebGL sahnesi kilidi MonaShard'da).
 */
export function ServiceDirectory({
  items,
  rail,
  title,
  titleId,
}: {
  items: readonly ServiceDirectoryItem[];
  rail: string;
  title: ReactNode;
  titleId: string;
}) {
  const gridRef = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  const [aiHover, setAiHover] = useState(false);
  const [monaMounted, setMonaMounted] = useState(false);

  // MONA yalnız AI kartı ÜZERİNDE KALINDIĞINDA kurulur: ızgarada gezinirken
  // her geçişte bir WebGL bağlamı kurulup yıkılmasın.
  useEffect(() => {
    if (!aiHover) {
      setMonaMounted(false);
      return;
    }
    const timer = window.setTimeout(() => setMonaMounted(true), 180);
    return () => window.clearTimeout(timer);
  }, [aiHover]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-inview", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    setArmed(true);
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <section className={styles.directory} aria-labelledby={titleId}>
      <p className={`lab-rail ${styles.rail}`}>
        {rail}
        <ScribbleArrow className={styles.railArrow} />
      </p>
      <h2 id={titleId} className={`lab-h2 ${styles.title}`}>
        {title}
      </h2>

      <ol ref={gridRef} className={styles.grid} data-armed={armed ? "" : undefined}>
        {items.map((item, index) => {
          // LAB: AI kartı artık kimliğinden tanınır (fotoğrafı var: AI
          // showreel karesi); hover'da MONA fotoğrafın üstünde belirir.
          const isAi = item.id === "aiCreativeProduction";
          const aiHandlers = isAi
            ? {
                onPointerEnter: () => setAiHover(true),
                onPointerLeave: () => setAiHover(false),
                onFocus: () => setAiHover(true),
                onBlur: () => setAiHover(false),
              }
            : {};

          return (
            <li
              key={item.id}
              className={styles.card}
              data-card=""
              data-service={item.id}
              style={{ "--col": index % 4, "--col2": index % 2 } as CSSProperties}
              {...aiHandlers}
            >
              {/* Dekoratif numara CSS `content: attr()` ile çizilir: metin
                  düğümü yok, kontrast denetimine takılmaz, okunmaz. */}
              <span
                className={styles.number}
                aria-hidden="true"
                data-number={String(index + 1).padStart(2, "0")}
              />

              <div className={styles.media}>
                {item.image ? (
                  <Image
                    className={styles.image}
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1100px) 23vw, (min-width: 700px) 46vw, 100vw"
                    quality={85}
                    draggable={false}
                    style={{ objectPosition: item.image.focus }}
                  />
                ) : (
                  <div className={styles.aiStage} data-ground="black">
                    <div className={styles.typePoster} aria-hidden="true">
                      <span>H360 / AI</span>
                      <strong lang="en">{item.name}</strong>
                    </div>
                  </div>
                )}
                {isAi ? (
                  <div className={styles.aiOverlay} data-active={aiHover ? "" : undefined} aria-hidden="true">
                    {monaMounted ? <MonaShard placement="center" /> : null}
                  </div>
                ) : null}
              </div>

              <h3 className={styles.name}>
                <Link href={item.href} className={styles.link} lang="en">
                  <span>{item.name}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </h3>
              <p className={styles.description}>{item.description}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
