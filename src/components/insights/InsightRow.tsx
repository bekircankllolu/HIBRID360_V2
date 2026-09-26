import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { getInsightCategory, getInsightTitle } from "@/lib/insights";
import { getInsightVisual } from "@/data/insight-visuals";
import type { InsightsPost } from "@/types/content";
import { splitInsightTitle } from "./split-insight-title";
import styles from "./InsightsList.module.css";

/**
 * LAB (monks "On our minds") — tek yazı satırı:
 * kategori | başlık (grotesk + serif) | okuma süresi | Oku hap + ok.
 *
 * Satırın TEK bağlantısı "Oku" butonu; `::after` ile bütün satırı
 * kaplar (iç içe bağlantı yok, sekme sırasında satır başına bir durak).
 * Butonun erişilebilir adı "Oku: <başlık>" — ekran okuyucunun bağlantı
 * listesinde 16 tane çıplak "Oku" görünmesin (WCAG 2.4.4); görünen etiket
 * adın başında kaldığı için 2.5.3 de sağlanıyor.
 */
export function InsightRow({ post, locale }: { post: InsightsPost; locale: Locale }) {
  const t = useTranslations("lab.insights");
  const title = getInsightTitle(post, locale);
  const { lead, rest } = splitInsightTitle(title);
  const category = getInsightCategory(post, locale);
  const minutes = post.read_time_minutes;

  return (
    <li className={styles.row} data-reveal-row data-tone={getInsightVisual(post, locale).tone}>
      {category && (
        <span className={styles.rowCategory}>
          <span className={styles.chip}>{category}</span>
        </span>
      )}
      <h3 className={styles.rowTitle}>
        <span className={styles.rowLead}>{lead}</span>
        {rest && (
          <>
            {" "}
            <span className={styles.rowRest}>{rest}</span>
          </>
        )}
      </h3>
      {minutes ? (
        <span className={styles.rowTime}>
          {t.rich("readTime", { minutes, b: (chunks) => <strong>{chunks}</strong> })}
        </span>
      ) : null}
      <Button
        href={`/think-and-thank/${post.slug}`}
        size="sm"
        variant="primary"
        className={styles.rowLink}
      >
        {t("readNow")}
        <span className={styles.srOnly}>: {title}</span>
      </Button>
    </li>
  );
}
