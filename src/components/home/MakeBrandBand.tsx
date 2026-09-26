import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Scribble } from "@/components/lab/Scribble";
import styles from "./MakeBrandBand.module.css";

/**
 * HOME-07 — "Make your brand “the” brand". Tıklanınca WORK sayfasına gider.
 *
 * LAB v2 (26 Eylül 2026, kullanıcı: "sade bir bölüme çevir, deneyelim;
 * olmazsa geri döneriz"): fotoğraf üstü bant kalktı (görsel
 * `siteImages.home.makeBrand` duruyor). Siyah zeminde sol etiket + dev dar
 * başlık + "the" etrafında sarı el çizimi halka + köşeli buton — hemen
 * ardından gelen siyah ekosistem sahnesine giriş cümlesi gibi okunur.
 */
export function MakeBrandBand() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <section className={styles.lab} data-ground="black" aria-labelledby="make-brand-title">
      <p className={`lab-rail ${styles.labRail}`} lang="en">
        {tNav("work")}
      </p>
      <div className={styles.labBody}>
        <h2 id="make-brand-title" className={`lab-display ${styles.labTitle}`} lang="en">
          {t.rich("makeBrand", {
            mark: (chunks) => (
              <Scribble shape="circle" tone="yellow" delay={200}>
                {chunks}
              </Scribble>
            ),
          })}
        </h2>
        <Button href="/work" size="sm">
          {tNav("work")}
        </Button>
      </div>
    </section>
  );
}
