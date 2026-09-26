import type { Locale } from "@/i18n/routing";
import type { InsightsPost } from "@/types/content";
import { InsightRow } from "./InsightRow";
import styles from "./InsightsList.module.css";

/**
 * Yazı sayfasının sonundaki "Diğer yazılar" — dizindeki satır dilinin
 * aynısı (kategori çipi | başlık | okuma süresi | Oku). Başlığı çağıran verir.
 */
export function InsightRelated({
  posts,
  locale,
  labelledBy,
}: {
  posts: readonly InsightsPost[];
  locale: Locale;
  labelledBy: string;
}) {
  if (posts.length === 0) return null;
  return (
    <ol className={styles.rows} aria-labelledby={labelledBy}>
      {posts.map((post) => (
        <InsightRow key={post.id} post={post} locale={locale} />
      ))}
    </ol>
  );
}
