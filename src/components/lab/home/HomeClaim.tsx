import { useTranslations } from "next-intl";
import { BRAND_SIGNATURE_LINES } from "@/lib/site";
import { LitText } from "../LitText";
import styles from "./HomeClaim.module.css";

/**
 * LAB (monks "Our Agents" iddiası) — markanın imza cümlesi, kaydırdıkça
 * kelime kelime koyulaşan geniş kalın başlık. Ardından gelen film bölümü
 * (ClosingBody) artık metinsiz: cümle bir kez, burada okunur.
 */
export function HomeClaim() {
  const t = useTranslations("lab.home");
  return (
    <section className={styles.section} data-ground="paper">
      <p className={`lab-rail ${styles.rail}`} lang="en">
        {t("claimRail")}
      </p>
      <LitText as="h2" className={`lab-h2 ${styles.claim}`} text={BRAND_SIGNATURE_LINES.join(" ")} />
    </section>
  );
}
