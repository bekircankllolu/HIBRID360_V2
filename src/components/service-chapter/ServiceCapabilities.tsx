import { Reveal } from "@/components/lab/Reveal";
import { offeringCase } from "./offering-case";
import styles from "./ServiceCapabilities.module.css";

/**
 * LAB (monks desen 2) — kademeli kart ızgarası: 4 sütun, çift sütunlar
 * aşağıda; her kartın arkasından yarısı görünen dev dolu numara.
 *
 * Kartlar bağlantı değil (alt sayfa yok): tıklanır görünen "+"/ok yok.
 * Numara dekoratif (`aria-hidden`); sıra `<ol>` ile zaten okunuyor.
 */
export function ServiceCapabilities({
  items,
  serviceName,
}: {
  items: readonly string[];
  serviceName: string;
}) {
  return (
    <ol className={styles.grid}>
      {items.map((item, index) => (
        <Reveal as="li" key={item} delay={(index % 4) * 90} className={styles.item}>
          <span className={styles.number} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={styles.card}>
            <p className={`lab-meta ${styles.meta}`} lang="en">
              {serviceName}
            </p>
            <h3 className={`lab-h3 ${styles.title}`} lang="en">
              {offeringCase(item)}
            </h3>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
