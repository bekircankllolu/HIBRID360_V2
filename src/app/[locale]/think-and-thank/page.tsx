import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { InsightsList } from "@/components/insights/InsightsList";
import { YouTubeLite } from "@/components/insights/YouTubeLite";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { insightsPosts } from "@/data/insights";
import type { Locale } from "@/i18n/routing";
import { getPublishedInsights } from "@/lib/content";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insights" });
  const fromDb = await getPublishedInsights();
  const hasPublishedPosts =
    fromDb.length > 0 || insightsPosts.some((post) => post.is_published);

  return {
    title: "Think & Thank",
    description: t("heroSubtitle"),
    robots: hasPublishedPosts ? undefined : { index: false, follow: true },
    alternates: localizedAlternates(locale, "/think-and-thank"),
  };
}

/**
 * LAB — Think & Thank, monks.com "On our minds" diliyle.
 *
 *   PageIntro (paper)   "Hibrid 360 Mag" + konuşan başlık (el çizimi halka +
 *                       serif ikinci ses) + giriş cümlesi
 *   InsightsList        sayaç + kategori → asimetrik öne çıkan üçlü → satır listesi
 *   Nesne (pink)        sayfanın tek vurgu bölümü; kaydırmayla dönen dairesel görsel
 *   Film (black)        tam genişlik video bloğu — pembe ile layout'un sarı
 *                       CtaBand'i yan yana gelmesin diye arada siyah
 *
 * Dergi tonları (mint/pembe/lila) artık zemin değil, yazının RENK ÇİPİ:
 * kart görselinin zemini, satırın kategori çipi ve üzerine gelince satır
 * tonu. Taban her yerde sitenin `paper`'ı.
 *
 * Kaldırılanlar (dosyaları duruyor): `MorphingHeroTitle` ve
 * `KineticStatement` (büyük harfli başlık/slogan — lab kuralı cümle düzeni),
 * `ScrollContours` (PageIntro ızgarasıyla çakışıyordu).
 */
export default async function ThinkAndThankPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("insights");
  const tLab = await getTranslations("lab.insights");
  const fromDb = await getPublishedInsights();
  const publishedPosts =
    fromDb.length > 0 ? fromDb : insightsPosts.filter((post) => post.is_published);
  const isTr = locale === "tr";

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Think & Thank", path: "/think-and-thank" },
        ])}
      />

      <PageIntro
        rail={<span lang="en">{t("heroEyebrow")}</span>}
        title={
          <>
            <span lang="en">
              Think &amp;{" "}
              <span className={styles.mark}>
                <Scribble shape="circle" tone="current" delay={300}>
                  Thank
                </Scribble>
              </span>
            </span>{" "}
            <span className={`lab-serif ${styles.titleSerif}`}>{t("heroLead")}</span>
          </>
        }
        lede={t("heroSubtitle")}
      />

      <InsightsList posts={publishedPosts} locale={locale} />

      {/* LAB v2 (26 Eylül 2026, kullanıcı: "pembe illüstrasyon dünyası farklı
          durmuş, sitenin diline uygun bir şey ayarla"): pembe nesne bölümü
          (dönen plak illüstrasyonu) ile siyah film bölümü tek bir monks "İzle"
          bölümünde birleşti. Nesne bölümünün iki cümlesi başlığın serif alt
          metni oldu; video kapağı siyah-beyaz, köşeli "İzle" düğmesi. */}
      <Section ground="paper" rail={tLab("filmRail")} labelledBy="featured-thinking-film">
        <div className={styles.watchHead}>
          <h2 id="featured-thinking-film" className={`lab-display ${styles.watchTitle}`}>
            {isTr ? "Fikir hareket ettiğinde." : "When an idea moves."}
          </h2>
          <p className={`lab-serif ${styles.watchLede}`}>
            {isTr
              ? "Fikirler dolaşır. Form değiştirir. Kültür, ses ve görüntü aynı yaratıcı sistemde buluşur."
              : "Ideas travel. Form changes. Culture, sound and image meet inside one creative system."}
          </p>
        </div>
        <div className={styles.videoFrame}>
          <YouTubeLite
            title={isTr ? "Hibrid 360 Think & Thank videosu" : "Hibrid 360 Think & Thank video"}
            playLabel={isTr ? "Think & Thank videosunu oynat" : "Play the Think & Thank video"}
            watchLabel={isTr ? "İzle" : "Watch"}
          />
        </div>
      </Section>
    </div>
  );
}
