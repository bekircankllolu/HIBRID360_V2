import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Scribble } from "@/components/lab/Scribble";
import styles from "./ClosingBand.module.css";

/**
 * HOME-12 — sayfa sonu çağrısı. Buton WORK sayfasına gider.
 *
 * LAB (monks "Let's unlock what's possible together."): sarı zemin, sol
 * etiket, dev dar başlık (son kelime el çizimi alt çizgili) ve köşeli buton
 * — footer'ın siyahından önceki son renkli an. Eski bisiklet görselli bant
 * kaldırıldı (görsel `siteImages.home.closing` duruyor).
 */
export function ClosingBand() {
  const t = useTranslations("home.closing");
  const tNav = useTranslations("nav");
  const title = t("title");
  const lastSpace = title.lastIndexOf(" ");
  const head = lastSpace > 0 ? title.slice(0, lastSpace) : "";
  const tail = lastSpace > 0 ? title.slice(lastSpace + 1) : title;

  return (
    <section className={styles.band} data-ground="paper" aria-labelledby="home-closing-title">
      <p className={`lab-rail ${styles.rail}`} lang="en">
        {tNav("work")}
      </p>
      <div className={styles.content}>
        <h2 id="home-closing-title" className={`lab-display ${styles.title}`}>
          {head}{" "}
          <Scribble shape="underline" tone="fuchsia" delay={200}>
            {tail}
          </Scribble>
        </h2>
        <Button href="/work">{t("subtitle")}</Button>
      </div>
    </section>
  );
}
