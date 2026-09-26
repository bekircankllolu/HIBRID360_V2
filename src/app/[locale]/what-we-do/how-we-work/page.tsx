import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { processSteps, budgetBands } from "@/data/how-we-work";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";
import { ClosingCall } from "../_lab/ClosingCall";
import styles from "./page.module.css";

/**
 * brief-rev12.md Bölüm 20.5 — How We Work.
 * İngilizce metinler (beş adımlık süreç, bütçe bandı tablosu) SİTEYE GİRECEK
 * METİN kutularından birebir. "NO BLACK BOX." marka sloganıdır, her iki
 * locale'de İngilizce kalır; gövde metni Türkçe sürümde çevrilidir
 * (src/data/how-we-work.ts — çeviri müşteri onayı bekliyor).
 *
 * TODO: docs/DECISIONS.md #15 bekleniyor — bütçe bandı başlangıç rakamları
 * ([X]) ve süre bantları ([n] weeks) ticari karardır. Rakam uydurulmadı:
 * ilgili hücreler "belirlenecek" rozetiyle render ediliyor (kullanıcı
 * kararı: rozetler yayında KALIR).
 *
 * LAB (monks.com) — bölüm sırası:
 *   1. PageIntro SİYAH zeminde: "No black box." — slogan kendi zemininde,
 *      "black box" el çizimi halkayla işaretli.
 *   2. Kağıt: süreç — dev numaralı büyük satırlar (numara | başlık + gövde).
 *   3. Siyah: bütçe bandı — satır envanteri (desen 5), gerçek <table>.
 *   4. Kağıt: kapanış — tek CTA: Brief Builder (brief 20.5).
 *   Sayfa sonu çağrısı layout'taki global CtaBand (sarı).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "How We Work",
    description:
      locale === "en"
        ? "How a project runs here, what it costs, and how long it takes."
        : "Bir projenin Hibrid 360’ta nasıl ilerlediği, bütçe yapısı ve üretim takvimi.",
    alternates: localizedAlternates(locale, "/what-we-do/how-we-work"),
  };
}

export default async function HowWeWorkPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("howWeWork");
  const tLab = await getTranslations("lab.howWeWork");

  const pendingBadge = (
    <span className={styles.pending} title={t("pendingHint")}>
      {t("pendingShort")}
    </span>
  );

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Do", path: "/what-we-do" },
          { name: "How We Work", path: "/what-we-do/how-we-work" },
        ])}
      />

      <PageIntro
        ground="black"
        rail={<span lang="en">How We Work</span>}
        title={
          <span lang="en" className={styles.introTitle}>
            No{" "}
            <Scribble shape="circle" tone="current" delay={300}>
              black box.
            </Scribble>
          </span>
        }
        lede={t("lead")}
      />

      <Section ground="paper" wide labelledBy="hww-process-title" className={styles.process}>
        <h2 id="hww-process-title" className={`lab-rail ${styles.sectionRail}`}>
          {t("processTitle")}
        </h2>
        <ol className={styles.steps}>
          {processSteps[locale].map((step, index) => {
            const [before, after] = step.body.split("{pending}");
            return (
              <Reveal as="li" key={step.step} delay={index * 60} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(step.step).padStart(2, "0")}
                </span>
                <div className={styles.stepText}>
                  <h3 className={styles.stepTitle}>
                    <span className="srOnly">
                      {tLab("stepLabel")} {step.step}:{" "}
                    </span>
                    {step.title}
                  </h3>
                  <p className={styles.stepBody}>
                    {before}
                    {after !== undefined && (
                      <>
                        {pendingBadge}
                        {after}
                      </>
                    )}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <Section ground="black" wide labelledBy="hww-budget-title" className={styles.budget}>
        <h2 id="hww-budget-title" className={`lab-rail ${styles.sectionRail}`}>
          {t("budgetTitle")}
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t("table.format")}</th>
                <th scope="col">{t("table.startingFrom")}</th>
                <th scope="col">{t("table.scope")}</th>
                <th scope="col">{t("table.duration")}</th>
              </tr>
            </thead>
            <tbody>
              {budgetBands[locale].map((band) => (
                <tr key={band.format}>
                  <th scope="row" className={styles.formatCell}>
                    {band.format}
                  </th>
                  <td data-label={t("table.startingFrom")}>{band.startingFrom ?? pendingBadge}</td>
                  <td data-label={t("table.scope")} className={styles.scopeCell}>
                    {band.scope.join(" · ")}
                  </td>
                  <td data-label={t("table.duration")}>{band.duration ?? pendingBadge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`lab-meta ${styles.tableNote}`}>{t("pendingHint")}</p>
      </Section>

      {/* brief 20.5: "Sayfanın altında tek CTA: Brief Builder (20.8)". */}
      <ClosingCall
        ground="paper"
        id="hww-closing-title"
        rail={tLab("closingRail")}
        title={tLab.rich("closingTitle", {
          mark: (chunks) => (
            <Scribble shape="underline" tone="fuchsia" delay={200}>
              {chunks}
            </Scribble>
          ),
        })}
        actions={<Button href="/brief">{t("cta")}</Button>}
      />
    </div>
  );
}
