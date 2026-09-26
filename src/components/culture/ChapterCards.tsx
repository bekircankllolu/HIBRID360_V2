import Image from "next/image";
import { Reveal } from "@/components/lab/Reveal";
import { Link } from "@/i18n/navigation";
import { pad2 } from "./lab-text";
import styles from "./ChapterCards.module.css";

export interface ChapterCard {
  href: string;
  title: string;
  /** Dekoratif önizleme — bağlantının anlamını başlık taşıyor (alt=""). */
  image: string;
  /** Başlığın dili (TR sayfada İngilizce kalan bölüm adı). */
  lang?: string;
}

/**
 * LAB (monks.com kademeli kart ızgarası, desen 2) — Culture hub'ının alt
 * sayfalarına giden kartlar. Geniş ekranda çift sütunlar aşağıda; kartın
 * arkasında yarısı görünen dev dolu numara; altında etiket + başlık + ok
 * dairesi. Tüm kart tek bağlantı (başlık bağlantının adı).
 */
export function ChapterCards({ items, eyebrow }: { items: readonly ChapterCard[]; eyebrow: string }) {
  return (
    <ol className={styles.grid}>
      {items.map((item, index) => (
        <Reveal as="li" key={item.href} delay={index * 80} className={styles.cell}>
          <span className={styles.number} aria-hidden="true">
            {pad2(index + 1)}
          </span>
          <Link href={item.href} className={styles.card}>
            <span className={styles.media}>
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 20vw"
                className={styles.image}
              />
            </span>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <span className={styles.titleRow}>
              <span className={`lab-h3 ${styles.title}`} lang={item.lang}>
                {item.title}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}
