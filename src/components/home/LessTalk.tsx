import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { splitLead } from "./less-talk";
import styles from "./LessTalk.module.css";

/**
 * HOME-10 — "Az laf, çok iş".
 *
 * LAB v2 (26 Eylül 2026, kullanıcı: "sitenin fontlarıyla yeniden yap"):
 * eski poster dili (Syne, oval halka, barkod künye, ölçüye sığdırma) kalktı.
 * Artık sitenin iki sesi: "az laf," editoryal serif, "çok iş" geniş kalın
 * grotesk + el çizimi halka. Üç paragraf monks satır listesi: numara |
 * kalın açılış + soluk devam. Metinler deck'teki haliyle, değişmedi.
 */
export function LessTalk() {
  const t = useTranslations("home.lessTalk");
  const locale = useLocale();
  const paragraphs = t.raw("paragraphs") as string[];
  const title = t("title");
  const [talk = title, work = ""] = title.split(/(?<=,)\s+/);
  const lower = (text: string) => text.toLocaleLowerCase(locale === "tr" ? "tr" : "en");

  return (
    <section className={styles.lab} data-ground="black" aria-labelledby="less-talk-title">
      <p className={`lab-rail ${styles.labRail}`} lang="en">
        Hibrid 360
      </p>

      <h2 id="less-talk-title" className={styles.labTitle} aria-label={title}>
        <span className={`lab-serif ${styles.labTalk}`} aria-hidden="true">
          {lower(talk)}
        </span>
        {work ? (
          <span className={styles.labWork} aria-hidden="true">
            <Scribble shape="circle" tone="yellow" delay={250}>
              {lower(work)}
            </Scribble>
          </span>
        ) : null}
      </h2>

      <ol className={styles.labList}>
        {paragraphs.map((paragraph, index) => {
          const { lead, rest } = splitLead(paragraph);
          return (
            <Reveal as="li" key={index} delay={index * 90} className={styles.labRow}>
              <span className={styles.labIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={styles.labLead}>{lead}</p>
              {rest ? <p className={`lab-body ${styles.labRest}`}>{rest}</p> : <span />}
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
