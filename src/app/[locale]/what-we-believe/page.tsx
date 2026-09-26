import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { NumberedRows } from "@/components/culture/NumberedRows";
import { ValueCards } from "@/components/culture/ValueCards";
import { sentenceCase } from "@/components/culture/lab-text";
import { LitText } from "@/components/lab/LitText";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { breadcrumbListJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import { BELIEF_IMAGES, type ResponsiveImage } from "@/data/what-we-believe";
import { CULTURE_INTRO, CULTURE_VALUES } from "@/data/culture-values";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * WWB-01..06 (nihai copy deck, Ağustos 2026) — What We Believe.
 *
 * 29 Ağustos 2026: canonical /what-we-believe (eski /culture/* yolu
 * kalıcı yönlendirme). Müşteri Atatürk ve Küçük Prens bölümlerinin
 * korunmasını istedi. 19 Eylül 2026: görsellerde sarı efekt yok (nötr
 * siyah-beyaz), metin görselin üstünde değil altında, temsili röportaj
 * videosu kaldırıldı (`BeliefFounderVideo` dosyada duruyor, çağrılmıyor).
 *
 * TELİF AÇIK BLOCKER: iki görselin de kullanım hakkı teyit edilmedi
 * (Küçük Prens en yüksek riskli madde). Bkz. docs/visual-audit/
 * BLOCKERS.md ve docs/content/LEGACY_CONTENT_ROUTE_MAP.md.
 *
 * WWB-06 [KARAR]: "Everything in the world created by women" alıntısı
 * birincil kaynağı gösterilemediği için alınmadı, yerine alıntı
 * uydurulmadı. Atatürk bandının altındaki metin şirketin kendi manifesto
 * cümlesidir; tırnak içinde değil, imzasız — alıntı gibi okunmasın diye.
 *
 * LAB (monks.com dili) — zemin ritmi:
 *   PageIntro (kağıt; slogan sans + serif, altında "Fikirden etkiye" satırı)
 *   → Vizyon, Misyon (kağıt; numaralı büyük satırlar — misyondaki em-dash
 *     iki ses: "Doğru ekip" sans + "deneyimli ekip" serif)
 *   → Culture is what we practise (pembe vurgu; monks "Our Values" kartları)
 *   → İlham, İlkeler (kağıt; numaralı okunur satırlar)
 *   → İki film karesi (siyah; manifesto kelime kelime yanar — tek büyük
 *     hareket anı; Küçük Prens alıntısı serif).
 * Büyük harfli başlıklar cümle düzenine indi; metin aynı.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title.whatWeBelieve"),
    alternates: localizedAlternates(locale, "/what-we-believe"),
  };
}

/** Siyah-beyaz arşiv karesi — AVIF → WebP → yedek, doğal ölçülü (CLS 0). */
function BandPicture({ image, locale, tall = false }: { image: ResponsiveImage; locale: Locale; tall?: boolean }) {
  return (
    <div className={`${shared.bandMedia} ${tall ? styles.tall : styles.wide}`}>
      <picture>
        <source type="image/avif" srcSet={image.avif} sizes="(max-width: 760px) 100vw, 92vw" />
        <source type="image/webp" srcSet={image.webp} sizes="(max-width: 760px) 100vw, 92vw" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.image}
          src={image.fallback}
          width={image.width}
          height={image.height}
          alt={image.alt[locale]}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default async function WhatWeBelievePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("culture.whatWeBelieve");
  const tLab = await getTranslations("lab.culture.believe");

  const list = (key: "vision" | "mission" | "inspires" | "edict") => ({
    title: t(`${key}.title`),
    items: t.raw(`${key}.items`) as string[],
  });
  const vision = list("vision");
  const mission = list("mission");
  const inspires = list("inspires");
  const edict = list("edict");
  const englishTitle = locale === "tr" ? "en" : undefined;

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Believe", path: "/what-we-believe" },
        ])}
      />

      {/* Slogan iki dilde de İngilizce (marka dili). */}
      <PageIntro
        rail={tLab("rail")}
        title={
          <span lang={englishTitle}>
            Beyond{" "}
            <Scribble shape="underline" tone="fuchsia" delay={300}>
              production:
            </Scribble>{" "}
            <span className="lab-serif">an AI-native creative organization</span>
          </span>
        }
        lede={t("bandLead")}
      />

      <Section ground="paper" rail={<span aria-hidden="true">{vision.title}</span>} labelledBy="wwb-vision">
        <h2 id="wwb-vision" className="srOnly">
          {vision.title}
        </h2>
        <NumberedRows size="lg" rows={vision.items.map((text) => ({ text }))} />
      </Section>

      <Section ground="paper" rail={<span aria-hidden="true">{mission.title}</span>} labelledBy="wwb-mission" className={styles.follow}>
        <h2 id="wwb-mission" className="srOnly">
          {mission.title}
        </h2>
        <NumberedRows size="lg" rows={mission.items.map((text) => ({ text }))} />
      </Section>

      <Section wide ground="pink" rail={tLab("values")} labelledBy="culture-values-title">
        <div className={styles.valuesHead}>
          <h2 id="culture-values-title" className="lab-h2" lang={englishTitle}>
            Culture is what we practise
          </h2>
          <div className={styles.valuesIntro}>
            {CULTURE_INTRO[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ValueCards
          items={CULTURE_VALUES.map((value) => ({
            title: sentenceCase(value.title, "en"),
            titleLang: englishTitle,
            body: value.body[locale],
          }))}
        />
      </Section>

      <Section ground="paper" rail={<span aria-hidden="true">{inspires.title}</span>} labelledBy="wwb-inspires">
        <h2 id="wwb-inspires" className="srOnly">
          {inspires.title}
        </h2>
        <NumberedRows rows={inspires.items.map((text) => ({ text }))} voice={false} ordered={false} />
      </Section>

      <Section ground="paper" rail={<span aria-hidden="true">{edict.title}</span>} labelledBy="wwb-edict" className={styles.follow}>
        <h2 id="wwb-edict" className="srOnly">
          {edict.title}
        </h2>
        <NumberedRows rows={edict.items.map((text) => ({ text }))} voice={false} />
      </Section>

      {/* LAB v2 (26 Eylül 2026, kullanıcı: "Atatürk ve Küçük Prens dursun,
          farklı ele alalım; üzerlerindeki yazılar güzel görünsün"): alt alta
          iki dev kare yerine monks'un editoryal görsel + metin bölünmesi,
          yönleri ve zeminleri dönüşümlü. Görseller ve metinler aynı. */}
      <section data-ground="black" className={styles.inspire} aria-label={inspires.title}>
        {/* Atatürk karesi — altındaki metin şirketin kendi manifesto cümlesi;
            tırnak ve imza YOK (bkz. dosya başı notu). */}
        <figure className={styles.inspireFigure}>
          <div className={styles.inspireMedia}>
            <BandPicture image={BELIEF_IMAGES.ataturk} locale={locale} />
          </div>
          <figcaption className={styles.inspireText}>
            <span className="lab-rail">{inspires.title}</span>
            <LitText as="p" className={`lab-h2 ${styles.inspireManifesto}`} text={t("manifesto")} />
          </figcaption>
        </figure>
      </section>

      <section data-ground="paper" className={`${styles.inspire} ${styles.inspireFlip}`} aria-label={t("quoteAuthor")}>
        {/* Küçük Prens — alıntı ve atıf doğrulanmış (Antoine de Saint-Exupéry). */}
        <figure className={styles.inspireFigure}>
          <div className={styles.inspireMedia}>
            <BandPicture image={BELIEF_IMAGES.littlePrince} locale={locale} tall />
          </div>
          <figcaption className={styles.inspireText}>
            <blockquote className={`lab-serif ${styles.inspireQuote}`}>{t("quote")}</blockquote>
            <p className={`lab-meta ${styles.inspireAuthor}`}>{t("quoteAuthor")}</p>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
