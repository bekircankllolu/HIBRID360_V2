import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { CulturePending } from "@/components/culture/CulturePending";
import { DirectorCards } from "@/components/culture/DirectorCards";
import { splitVoice } from "@/components/culture/lab-text";
import { PageIntro } from "@/components/lab/PageIntro";
import { Section } from "@/components/lab/Section";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { getPublishedDirectors } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * brief-rev12.md Bölüm 20.3 — Directors & Crew.
 * Hero metinleri "SİTEYE GİRECEK METİN" kutularından birebir (messages).
 *
 * TODO: docs/DECISIONS.md #14 bekleniyor — sayfaya kaç kişi girecek ve
 * fotoğraf çekimi ne zaman yapılacak. Brief'in uyarısı: fotoğraflar tek
 * seansta, aynı ışıkta çekilmeli. Kadro + çekim tarihi gelmeden hiçbir
 * profil yayınlanmıyor; liste boşken sayfa noindex ve dürüst bekleme
 * durumu gösterir.
 *
 * LAB (monks.com insan portreli kart dili): PageIntro (kağıt; "Kadrajın"
 * sans + "arkasındakiler." serif) → kadro ızgarası (4 sütun portre kart)
 * ya da bekleme durumu.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "directors" });
  const directors = await getPublishedDirectors();
  return {
    title: "Directors & Crew",
    description: t("heroSubtitle"),
    robots: directors.length > 0 ? undefined : { index: false, follow: true },
    alternates: localizedAlternates(locale, "/culture/directors"),
  };
}

export default async function DirectorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("directors");
  const tLab = await getTranslations("lab.culture.directors");
  const tCommon = await getTranslations("common");
  const directors = await getPublishedDirectors();
  const title = splitVoice(t("heroTitle"), 0.5);

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Culture", path: "/culture" },
          { name: "Directors & Crew", path: "/culture/directors" },
        ])}
      />

      <PageIntro
        rail={tLab("rail")}
        title={
          <>
            {title.head} {title.tail ? <span className="lab-serif">{title.tail}</span> : null}
          </>
        }
        lede={t("heroSubtitle")}
      />

      <Section wide={directors.length > 0} ground="paper" rail={tLab("crew")} className={styles.crew}>
        {directors.length === 0 ? (
          <CulturePending label={tCommon("pendingLabel")} message={t("empty")} />
        ) : (
          <DirectorCards directors={directors} locale={locale} />
        )}
      </Section>
    </div>
  );
}
