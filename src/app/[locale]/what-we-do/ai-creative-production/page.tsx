import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LitText } from "@/components/lab/LitText";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble, ScribbleArrow } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { Mona } from "@/components/mona/Mona";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { monaQuestions, openingLine } from "@/data/mona";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { chapterOf, nextChapter } from "@/lib/service-chapter";
import { BRAND_SIGNATURE, localizedAlternates } from "@/lib/site";
import { ClosingCall } from "../_lab/ClosingCall";
import lab from "../_lab/lab.module.css";
import styles from "./page.module.css";

/**
 * AI Creative Production — sitenin en özgün sayfası (MONA).
 *
 * LAB (monks.com "AI" sayfa dili) — bölüm sırası:
 *   1. Pembe tema zemin: MONA sahnesi (sayfanın h1'i "MONA." sahnenin
 *      içinde) pembe bir çerçevede "ekran" gibi durur; altında dev başlık
 *      "Create the future." (serif ses + el çizimi alt çizgi) ve giriş.
 *   2. Kağıt: kelime kelime yanan iddia (slogan 1, LitText) + serif slogan 2.
 *   3. Kağıt: fark — soru başlığı + gövde.
 *   4. Siyah: "Neden Hibrid 360?" kanıt satırları + iş akışı adımları.
 *   5. Kağıt: "Neler üretiyoruz" büyük satır listesi.
 *   6. Siyah: bakış — manifesto + bant cümlesi + kapanış metni ve soru.
 *   7. Kağıt: MONA'nın tüm replikleri (metin) + sıradaki hizmet.
 *   Sayfa sonu çağrısı layout'taki global CtaBand (sarı).
 *
 * Metinler `aiCreativeProduction` sözlüğünden birebir; yeni UI etiketleri
 * `lab.aiCreative`. MONA'nın mantığına, sesine, durum makinesine
 * dokunulmadı; otomatik ses yok. Service Chapter şablon parçaları
 * (ChapterRule, ScrollLitText, ChapterIndex, ChapterNext, imza çizimi,
 * MonaDrift) bu sayfadan çıktı — sayfa kendi lab bileşenleriyle kurulu.
 */

const CHAPTER = chapterOf("aiCreativeProduction");
const RAIL_NAME = "AI Creative Production";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "AI Creative Production",
    description:
      locale === "en"
        ? "AI films, AI photography and hybrid production workflows — human creativity, AI precision, real impact."
        : "AI filmleri, AI fotoğrafçılık ve hibrit prodüksiyon akışları: insan yaratıcılığı, yapay zekâ hassasiyeti ve gerçek etki.",
    alternates: localizedAlternates(locale, "/what-we-do/ai-creative-production"),
  };
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

export default async function AiCreativeProductionPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations("aiCreativeProduction");
  const tLab = await getTranslations("lab.aiCreative");
  const tChapter = await getTranslations("services.chapter");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const tHow = await getTranslations("howWeWork");
  const slogans = t.raw("slogans") as string[];
  const proofList = t.raw("proofList") as string[];
  const flowSteps = t.raw("flowSteps") as string[];
  const buildList = t.raw("buildList") as string[];
  const next = nextChapter(CHAPTER.id);
  const nextBlurb =
    (tWhatWeDo.raw("list") as Array<{ title: string; body: string }>).find((item) => item.title === next.name)?.body ?? "";
  const brand = (chunks: ReactNode) => <span lang="en">{chunks}</span>;

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Do", path: "/what-we-do" },
          { name: "AI Creative Production", path: "/what-we-do/ai-creative-production" },
        ])}
      />

      {/* 1 — MONA sahnesi pembe çerçevede. Sahne ve davranışı olduğu gibi. */}
      <div className={styles.monaFrame} data-ground="black">
        <div className={styles.monaTop}>
          <p className={`lab-rail ${lab.railWithArrow}`} lang="en">
            {RAIL_NAME}
            <ScribbleArrow className={lab.railArrow} />
          </p>
          <p className="lab-rail">{tLab("monaRail")}</p>
        </div>
        <div className={styles.monaScreen}>
          <Mona locale={locale} />
        </div>
      </div>

      <div data-ai-continuation="" data-chapter={CHAPTER.id}>
        <PageIntro
          ground="pink"
          titleAs="h2"
          titleId="ai-intro-title"
          rail={<span lang="en">Hibrid AI</span>}
          title={
            <span lang="en">
              Create{" "}
              <span className="lab-serif">
                the{" "}
                <Scribble shape="underline" tone="current" delay={300}>
                  future.
                </Scribble>
              </span>
            </span>
          }
          lede={t("heroLead")}
        />

        {/* 2 — iddia: kaydırdıkça yanan slogan. */}
        <Section rail={tLab("manifestoRail")} ground="paper" className={styles.claim}>
          <div lang="en">
            <LitText as="p" className={`lab-h2 ${styles.claimText}`} text={slogans[0] ?? ""} />
            {slogans[1] && <p className={`lab-serif ${styles.claimSerif}`}>{slogans[1]}</p>}
          </div>
        </Section>

        {/* 3 — fark. */}
        <Section rail={tLab("diffRail")} ground="paper" labelledBy="ai-diff-title" className={styles.diff}>
          <h2 id="ai-diff-title" className={`lab-display ${styles.diffTitle}`}>
            {t("diffTitle")}
          </h2>
          <p className={`lab-body ${styles.diffBody}`}>{t("diffBody")}</p>
        </Section>

        {/* 4 — kanıt + iş akışı, siyah. */}
        <Section rail={tLab("proofRail")} ground="black" labelledBy="ai-proof-title" className={styles.proof}>
          <h2 id="ai-proof-title" className="lab-h2">
            {t.rich("proofTitle", { brand })}
          </h2>
          <p className={`lab-meta ${styles.proofLead}`}>{t("proofLead")}</p>
          <ol className={`${lab.rows} ${styles.proofRows}`}>
            {proofList.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 80} className={lab.row}>
                <span className={lab.rowIndex}>{pad(index)}</span>
                <p className={`${lab.rowText} ${styles.proofText}`}>{item}</p>
              </Reveal>
            ))}
          </ol>

          <h3 className={`lab-h3 ${styles.flowTitle}`}>{tLab("flowTitle")}</h3>
          <ol className={styles.flow}>
            {flowSteps.map((step, index) => (
              <Reveal as="li" key={step} delay={index * 90} className={styles.flowStep}>
                <span className={styles.flowIndex}>{pad(index)}</span>
                <span className={styles.flowName}>{step}</span>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* 5 — neler üretiyoruz: büyük satırlar. */}
        <Section ground="paper" wide labelledBy="ai-build-title" className={styles.build}>
          <h2 id="ai-build-title" className={`lab-rail ${styles.buildRail}`}>
            {t("buildTitle")}
          </h2>
          <ul className={styles.buildList}>
            {buildList.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 70} className={styles.buildItem}>
                <span className={styles.buildIndex}>{pad(index)}</span>
                <span className={styles.buildName}>{item}</span>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* 6 — bakış: manifesto + bant + kapanış. */}
        <ClosingCall
          ground="black"
          id="ai-statement-title"
          rail={tLab("statementRail")}
          title={
            <>
              {t("manifestoText")} <span className={`lab-serif ${styles.statementSerif}`}>{t("bandText")}</span>
            </>
          }
          lede={
            <>
              {t("closingBody")} <span lang="en">{BRAND_SIGNATURE}</span>
            </>
          }
          actions={
            <>
              <p className={`lab-h3 ${styles.closingQuestion}`}>{t("closingQuestion")}</p>
              <Button href="/brief">{tHow("cta")}</Button>
            </>
          }
        />

        {/* 7 — tüm replikler + sıradaki hizmet. */}
        <Section rail={tLab("transcriptRail")} ground="paper" tight className={styles.transcriptSection}>
          <details className={styles.transcript}>
            <summary className="lab-h3">{t("transcriptTitle")}</summary>
            <dl>
              <div>
                <dt>MONA</dt>
                <dd>{openingLine.text[locale]}</dd>
              </div>
              {monaQuestions.map((question) => (
                <div key={question.id}>
                  <dt>{question.question[locale]}</dt>
                  <dd>{question.text[locale]}</dd>
                </div>
              ))}
            </dl>
          </details>

          <Link href={next.href} className={styles.next}>
            <span className="lab-meta">{tChapter("next")}</span>
            <span className={styles.nextName} lang="en">
              {next.name}
            </span>
            <span className={styles.nextBlurb}>{nextBlurb}</span>
            <span className={styles.nextArrow} aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </Section>
      </div>
    </div>
  );
}
