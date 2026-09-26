import { Reveal } from "@/components/lab/Reveal";
import { Link } from "@/i18n/navigation";
import type { Director } from "@/types/content";
import styles from "./DirectorCards.module.css";

/** "Ayşe Nur Demir" → "AD" (portre yokken tipografik kart yüzü). */
export function initialsOf(fullName: string, locale: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : "";
  return `${first}${last}`.toLocaleUpperCase(locale);
}

/**
 * LAB (monks.com insan portreli kart dili) — yönetmen/ekip kartları.
 *
 * 4:5 portre; altında rol (soluk), ad (kart başlığı) + ok dairesi, tek
 * satırlık tanım. Portre henüz yoksa (DECISIONS.md #14 — çekim tek seansta
 * yapılacak) boş çerçeve DEĞİL, adın baş harfleriyle tipografik yüz:
 * sahte fotoğraf ya da stok görsel yok.
 */
export function DirectorCards({ directors, locale }: { directors: readonly Director[]; locale: "tr" | "en" }) {
  return (
    <ul className={styles.grid}>
      {directors.map((director, index) => {
        const oneLiner = locale === "tr" ? director.one_liner_tr : director.one_liner_en;
        return (
          <Reveal as="li" key={director.id} delay={(index % 4) * 80} className={styles.cell}>
            <Link href={`/culture/directors/${director.slug}`} className={styles.card}>
              <span className={styles.portrait}>
                {director.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Supabase/Cloudflare Images URL'i; srcset orada üretiliyor.
                  <img src={director.photo_url} alt="" loading="lazy" decoding="async" className={styles.photo} />
                ) : (
                  <span className={styles.initials} aria-hidden="true">
                    {initialsOf(director.full_name, locale)}
                  </span>
                )}
              </span>
              <span className={styles.role}>{director.role}</span>
              <span className={styles.nameRow}>
                <span className={`lab-h3 ${styles.name}`}>{director.full_name}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              {oneLiner ? <span className={styles.oneLiner}>{oneLiner}</span> : null}
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
