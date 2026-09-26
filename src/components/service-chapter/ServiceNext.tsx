import { ScribbleArrow } from "@/components/lab/Scribble";
import { Link } from "@/i18n/navigation";
import { formatDegree, nextChapter } from "@/lib/service-chapter";
import styles from "./ServiceNext.module.css";

/**
 * LAB — sayfa sonu (siyah; ardından layout'un sarı CtaBand'i): sıradaki hizmete giden dev bağlantı satırı.
 * monks'un sayfa sonu çağrısı + desen 4'ün büyük link satırı. Sekiz sayfa
 * birlikte tam tur: derece sayacı korunur (000° → 045° …).
 *
 * Bütün satır tek tıklama hedefi (bağlantının `::after`'ı satırı kaplar);
 * erişilebilir ad yalnız hizmet adı, `<nav aria-label>` bağlamı verir.
 */
export function ServiceNext({
  currentId,
  label,
  blurb,
}: {
  currentId: string;
  label: string;
  blurb: string;
}) {
  const next = nextChapter(currentId);

  return (
    <nav className={styles.next} data-ground="black" aria-label={label}>
      <div className={styles.head}>
        <p className={`lab-rail ${styles.label}`}>
          {label}
          <ScribbleArrow className={styles.scribble} />
        </p>
        <p className={`lab-meta ${styles.degree}`} aria-hidden="true">
          {formatDegree(next.degree)} / 360°
        </p>
      </div>

      <div className={styles.row}>
        <Link href={next.href} className={styles.link} lang="en" data-service-nav={next.id}>
          <span className={styles.name}>{next.name}</span>
        </Link>
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="square" />
          </svg>
        </span>
      </div>

      {blurb ? <p className={styles.blurb}>{blurb}</p> : null}
    </nav>
  );
}
