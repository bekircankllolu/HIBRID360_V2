import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EditorialImage } from "@/components/insights/EditorialImage";
import { InsightRelated } from "@/components/insights/InsightRelated";
import { ShareLinks } from "@/components/insights/ShareLinks";
import { pullQuoteOf, relatedPostsOf } from "@/components/insights/article";
import { splitInsightTitle } from "@/components/insights/split-insight-title";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { getInsightVisual } from "@/data/insight-visuals";
import { insightsPosts } from "@/data/insights";
import { routing, type Locale } from "@/i18n/routing";
import { getPublishedInsights } from "@/lib/content";
import {
  getInsightAuthor,
  getInsightCategory,
  getInsightParagraphs,
  getInsightSummary,
  getInsightTitle,
} from "@/lib/insights";
import { articleJsonLd, breadcrumbListJsonLd } from "@/lib/schema";
import { SITE_URL, localizedAlternates } from "@/lib/site";
import type { InsightsPost } from "@/types/content";
import styles from "./page.module.css";

export function generateStaticParams() {
  return insightsPosts
    .filter((post) => post.is_published)
    .flatMap((post) => routing.locales.map((locale) => ({ locale, slug: post.slug })));
}

/** Supabase bağlıysa oradan; değilse yerel (brief'ten içe aktarılmış) liste. */
async function getPosts(): Promise<InsightsPost[]> {
  const fromDb = await getPublishedInsights();
  return fromDb.length > 0 ? fromDb : insightsPosts.filter((post) => post.is_published);
}

async function getPost(slug: string): Promise<InsightsPost | null> {
  const fromDb = await getPublishedInsights();
  return (
    fromDb.find((post) => post.slug === slug) ??
    insightsPosts.find((post) => post.slug === slug && post.is_published) ??
    null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = getInsightTitle(post, locale);
  const description = getInsightSummary(post, locale) ?? undefined;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, `/think-and-thank/${slug}`),
  };
}

/**
 * LAB — Think & Thank yazısı, monks.com makale diliyle.
 *
 *   Baş (paper)     rail: kategori çipi + okuma süresi + yazar | dev dar
 *                   başlık (grotesk + serif ikinci ses) + özet
 *   Kapak           tam genişlik, yazının tonunda zemin (mint/pembe/lila)
 *   Gövde           rail: paylaş (yapışkan) | ~68ch okunaklı metin; ilk
 *                   paragraf serif giriş, araya yazının KENDİ son cümlesi
 *                   serif çekme alıntı olarak (ekran okuyucudan gizli —
 *                   metin iki kez okunmasın)
 *   Diğer yazılar   dizinle aynı satır dili
 *
 * e2e `think-and-thank.spec.ts`: gövde `div[class*='body'] > p` tam üç
 * paragraf — çekme alıntı `<figure>` olduğu için sayıma girmez.
 */
export default async function ThinkAndThankPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "insights" });
  const tLab = await getTranslations({ locale, namespace: "lab.insights" });
  const post = await getPost(slug);
  if (!post) notFound();

  const title = getInsightTitle(post, locale);
  const { lead, rest } = splitInsightTitle(title);
  const summary = getInsightSummary(post, locale);
  const category = getInsightCategory(post, locale);
  const author = getInsightAuthor(post, locale);
  const paragraphs = getInsightParagraphs(post, locale);
  const visual = getInsightVisual(post, locale);
  const quote = pullQuoteOf(paragraphs);
  const related = relatedPostsOf(await getPosts(), slug, 3);
  const url = `${SITE_URL}/${locale}/think-and-thank/${slug}`;

  return (
    <article className={styles.article} data-tone={visual.tone}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Think & Thank", path: "/think-and-thank" },
          { name: title, path: `/think-and-thank/${slug}` },
        ])}
      />
      <JsonLd data={articleJsonLd(locale, post)} />

      <header className={styles.header} data-ground="paper">
        <ul className={styles.facts} aria-label={t("articleInfo")}>
          {category && (
            <li className={styles.chip}>{category}</li>
          )}
          {post.read_time_minutes ? <li>{t("readTime", { minutes: post.read_time_minutes })}</li> : null}
          {author && <li>{author}</li>}
          {post.published_at && (
            <li>
              <time dateTime={post.published_at}>
                {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
                  new Date(post.published_at),
                )}
              </time>
            </li>
          )}
        </ul>
        <div className={styles.headline}>
          <h1 className={`lab-display ${styles.title}`}>
            {lead}
            {rest && (
              <>
                {" "}
                <span className={`lab-serif ${styles.titleRest}`}>{rest}</span>
              </>
            )}
          </h1>
          {summary && <p className={styles.summary}>{summary}</p>}
        </div>
      </header>

      <figure className={styles.cover}>
        <div className={styles.coverFrame}>
          <EditorialImage
            src={visual.src}
            alt={visual.alt}
            sizes="(max-width: 760px) 100vw, 92vw"
            priority
          />
        </div>
      </figure>

      <div className={styles.reading} data-ground="paper">
        <aside className={styles.aside}>
          <ShareLinks url={url} title={title} heading={tLab("share")} emailLabel={tLab("shareEmail")} />
        </aside>
        <div className={styles.body}>
          {paragraphs.map((paragraph, index) => (
            <FragmentWithQuote key={`${index}-${paragraph}`} showQuote={index === 0 ? quote : null}>
              <p>{paragraph}</p>
            </FragmentWithQuote>
          ))}
          <div className={styles.back}>
            <Button href="/think-and-thank" variant="ghost" size="sm">
              {t("backToIndex")}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} data-ground="paper" aria-labelledby="related-heading">
          <h2 id="related-heading" className={`lab-h2 ${styles.relatedTitle}`}>
            {tLab("related")}
          </h2>
          <InsightRelated posts={related} locale={locale} labelledBy="related-heading" />
        </section>
      )}
    </article>
  );
}

/** Paragraf + (varsa) hemen ardından çekme alıntı; ikisi de gövdenin doğrudan çocuğu. */
function FragmentWithQuote({
  children,
  showQuote,
}: {
  children: ReactNode;
  showQuote: string | null;
}) {
  return (
    <>
      {children}
      {showQuote && (
        <figure className={styles.quote} aria-hidden="true">
          <blockquote>
            <p>{showQuote}</p>
          </blockquote>
        </figure>
      )}
    </>
  );
}
