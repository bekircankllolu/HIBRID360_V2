import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { pad2 } from "@/components/culture/lab-text";
import { LitText } from "@/components/lab/LitText";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Section } from "@/components/lab/Section";
import { breadcrumbListJsonLd } from "@/lib/schema";
import {
  sustainabilityData,
  isSustainabilityPublishable,
  reductionMeasures,
} from "@/data/sustainability";
import type { Locale } from "@/i18n/routing";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * Sustainability — brief-rev12.md Bölüm 18.11.
 *
 * Brief'in istediği üç zorunlu bölüm: Measurement · Reduction · Offset
 * (artı "On set"). Ölçüm ve sertifika verisi girilmeden karbon nötr
 * iddiası YAYINLANMIYOR — brief'in greenwashing uyarısı gereği. Bu mantık
 * (isSustainabilityPublishable, noindex, bekleme mesajları, uyarı bandı)
 * LAB yeniden tasarımında AYNEN korundu; yalnız görsel dil değişti.
 *
 * TODO: brief 18.11 — ölçüm (araç + tarih + gram CO₂), yeşil hosting
 * sağlayıcısı ve denkleştirme sertifika numarası girilince
 * src/data/sustainability.ts güncellenecek; sayfa ve footer rozeti
 * otomatik olarak yayına açılır.
 * TODO: brief 18.11 — "On set" bölümü (prodüksiyonda ulaşım, catering,
 * atık, ekipman) operasyon tarafından yazılacak.
 *
 * LAB (monks.com dili): PageIntro (kağıt; mevcut İngilizce sloganlar cümle
 * düzeninde, sans + serif) → uyarı bandı (sarı, veri gelene kadar) → dört
 * bölüm numaralı satır, her birinde durum etiketi (kağıt) → kapanış
 * sloganı kelime kelime yanar (siyah — tek hareket anı).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainability" });
  return {
    title: t("title"),
    robots: isSustainabilityPublishable()
      ? undefined
      : { index: false, follow: true },
  };
}

function Status({ done, label }: { done: boolean; label: string }) {
  return (
    <span className={styles.status} data-state={done ? "complete" : "pending"}>
      <span className={styles.statusDot} aria-hidden="true" />
      {label}
    </span>
  );
}

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("sustainability");
  const tLab = await getTranslations("lab.culture.sustainability");
  const publishable = isSustainabilityPublishable();
  const english = locale === "tr" ? "en" : undefined;
  const status = (done: boolean) => <Status done={done} label={done ? tLab("complete") : tLab("pending")} />;
  const note = (text: string) => <p className={styles.pendingText}>{text}</p>;

  const chapters: Array<{ id: string; title: string; done: boolean; body: ReactNode }> = [
    {
      id: "measurement",
      title: t("measurementTitle"),
      done: publishable,
      body: publishable ? (
        <p className={styles.body}>
          {t("measurement", {
            grams: sustainabilityData.gramsCo2PerView ?? 0,
            tool: sustainabilityData.measurementTool ?? "",
            date: sustainabilityData.measuredOn ?? "",
          })}
        </p>
      ) : (
        note(t("measurementPending"))
      ),
    },
    {
      id: "reduction",
      title: t("reductionTitle"),
      done: Boolean(sustainabilityData.greenHostingProvider),
      body: (
        <>
          {/* Bu maddeler iddia değil, sitede uygulanmış mühendislik
              kararları — ölçüm verisi olmadan da doğrular. */}
          <ul className={styles.measures}>
            {reductionMeasures.map((measure) => (
              <li key={measure.en}>{measure[locale]}</li>
            ))}
          </ul>
          {!sustainabilityData.greenHostingProvider && note(t("hostingPending"))}
        </>
      ),
    },
    {
      id: "offset",
      title: t("offsetTitle"),
      done: publishable,
      body: publishable ? (
        <p className={styles.body}>
          {t("offset", {
            program: sustainabilityData.offsetProgram ?? "",
            certificate: sustainabilityData.offsetCertificateNumber ?? "",
          })}
        </p>
      ) : (
        note(t("offsetPending"))
      ),
    },
    {
      id: "on-set",
      title: t("onSetTitle"),
      done: false,
      body: note(t("onSetPending")),
    },
  ];

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Culture", path: "/culture" },
          { name: "Sustainability", path: "/culture/sustainability" },
        ])}
      />

      {/* h1 sayfanın adıyla başlar (ekran okuyucu + arama); görünen başlık
          mevcut İngilizce sloganlar. Rail aynı adı gösterir, tekrar okunmaz. */}
      <PageIntro
        rail={<span aria-hidden="true">{t("title")}</span>}
        title={
          <>
            <span className="srOnly">{t("title")}: </span>
            <span lang={english}>
              Our home is the world. <span className="lab-serif">Zero carbon. Full impact.</span>
            </span>
          </>
        }
        lede={t("intro")}
      />

      {!publishable && (
        <Section ground="yellow" tight rail={tLab("pending")}>
          <p className={styles.notice} role="note">
            {t("pendingEvidence")}
          </p>
        </Section>
      )}

      <Section wide ground="paper" rail={tLab("sections")}>
        <ol className={styles.chapters}>
          {chapters.map((chapter, index) => (
            <Reveal as="li" key={chapter.id} delay={index * 70} className={styles.chapter}>
              <span className={styles.index} aria-hidden="true">
                {pad2(index + 1)}
              </span>
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
              <div className={styles.chapterBody}>
                {status(chapter.done)}
                {chapter.body}
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section ground="black">
        <div lang={english}>
          <LitText as="p" className={`lab-display ${styles.closing}`} text="Create more. Carbon less." />
        </div>
      </Section>
    </div>
  );
}
