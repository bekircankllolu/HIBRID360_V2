import { getTranslations } from "next-intl/server";
import { Scribble } from "@/components/lab/Scribble";
import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

/**
 * LEG-04 (nihai copy deck, Ağustos 2026) — 404 sayfası. Başlık EN/TR'de
 * FARKLI ("THIS PAGE IS OFF FREQUENCY." / "BU SAYFA FREKANS DIŞINDA.") —
 * önceki sürüm marka dili varsayımıyla başlığı iki locale'de de
 * İngilizce bırakmıştı, deck'in kendisi ayrı TR çevirisi veriyor.
 *
 * LAB (monks cesur tipografi): kağıt zeminde sol rail "Hata 404", sağda
 * deck başlığı dev geniş kalın (lab-h2 ailesi, ekran boyu), son kelimesi
 * el çizimi halkada. Arkasında yarım görünen dev dolu "404" (monks'un
 * kart arkası numara deseni — dekoratif, ekran okuyucudan gizli).
 * Eylemler köşeli: birincil ana sayfa, ikincil deck'in WORK bağlantısı.
 */

/** Son kelimeyi ayırır: halka yalnız ona çizilir. */
function splitLastWord(text: string): [string, string] {
  const trimmed = text.trim();
  const index = trimmed.lastIndexOf(" ");
  if (index < 0) return ["", trimmed];
  return [trimmed.slice(0, index + 1), trimmed.slice(index + 1)];
}

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const tLab = await getTranslations("lab.notFound");
  const [lead, last] = splitLastWord(t("title"));

  return (
    <div className={styles.page} data-ground="paper">
      <span className={styles.ghost} aria-hidden="true">
        404
      </span>
      <p className={`lab-rail ${styles.rail}`}>{tLab("rail")}</p>
      <div className={styles.body}>
        <h1 className={styles.title}>
          {lead}
          <Scribble shape="circle" tone="current">
            {last}
          </Scribble>
        </h1>
        <p className={styles.lede}>{t("body")}</p>
        <div className={styles.actions}>
          <Button href="/">{tLab("home")}</Button>
          <Button href="/work" variant="ghost">
            {t("cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
