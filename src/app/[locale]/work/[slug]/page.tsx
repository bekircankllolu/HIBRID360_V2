import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { CaseMedia } from "@/components/work/CaseMedia";
import { isDirectVideo, nextWorkOf } from "@/components/work/case-study";
import { solutionsOf, workTitle } from "@/components/work/work-inventory";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPublishedDirectors, getPublishedWorks, getWorkBySlug } from "@/lib/content";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";
import styles from "./page.module.css";

/**
 * brief-rev12.md Bölüm 7.3 — vaka sayfası şablonu: Sorun / Çözüm / Sonuç /
 * Kanıt. "Proje değil, dönüşüm anlatılır."
 *
 * LAB — monks.com vaka dili:
 *   PageIntro (paper)   müşteri etiketi + dev proje başlığı + meta satırı
 *   CaseMedia (black)   tam genişlik film/görsel (poster + preload="none")
 *   Bölümler (paper)    rail'de başlık, sağda metin; sonuç büyük iddia olarak
 *   Kanıt               görsel galerisi — varlıklar gelene kadar dürüst çerçeve
 *   Sıradaki vaka       (black) sinematik geçiş; ardından layout'un sarı CtaBand'i
 *
 * TODO: docs/DECISIONS.md #16 bekleniyor — envanter gelmeden hiçbir vaka
 * yayınlanamaz; generateStaticParams boş döner, bilinmeyen slug 404 olur.
 */

export async function generateStaticParams() {
  const works = await getPublishedWorks();
  return works.flatMap((work) =>
    routing.locales.map((locale) => ({ locale, slug: work.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};

  // client_name gizli işlerde veritabanından null gelir (works_public view).
  const title =
    (locale === "tr" ? work.title_tr : work.title_en) ??
    work.title_en ??
    work.title_tr ??
    work.client_name ??
    "Case study";
  const description =
    (locale === "tr" ? work.case_problem_tr : work.case_problem_en) ?? undefined;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, `/work/${slug}`),
  };
}

export default async function WorkCasePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const t = await getTranslations("work");
  const tLab = await getTranslations("lab.works");
  const isTr = locale === "tr";
  const clientLabel = work.client_name ?? t("confidentialClient");
  const projectTitle =
    (isTr ? work.title_tr : work.title_en) ??
    work.title_en ??
    work.title_tr ??
    clientLabel;

  const chapters = [
    { key: "problem", title: t("case.problem"), text: isTr ? work.case_problem_tr : work.case_problem_en },
    { key: "solution", title: t("case.solution"), text: isTr ? work.case_solution_tr : work.case_solution_en },
    { key: "result", title: t("case.result"), text: isTr ? work.case_result_tr : work.case_result_en },
  ].filter((chapter): chapter is { key: string; title: string; text: string } => Boolean(chapter.text));

  const [works, directors] = await Promise.all([
    getPublishedWorks(),
    work.director_id ? getPublishedDirectors() : Promise.resolve([]),
  ]);
  const director = directors.find((d) => d.id === work.director_id);
  const next = nextWorkOf(works, slug);
  const solutions = solutionsOf(work);

  const directVideo = isDirectVideo(work.video_url) ? work.video_url : null;
  const externalVideo = work.video_url && !directVideo ? work.video_url : null;
  const hasMedia = Boolean(work.cover_image_url || directVideo);

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Work", path: "/work" },
          { name: clientLabel, path: `/work/${slug}` },
        ])}
      />

      <PageIntro
        rail={tLab("caseRail")}
        title={
          projectTitle === clientLabel ? (
            projectTitle
          ) : (
            <>
              {projectTitle}{" "}
              <span className={`lab-serif ${styles.titleClient}`}>{clientLabel}</span>
            </>
          )
        }
      >
        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>{tLab("colClient")}</dt>
            <dd>{clientLabel}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>{t("filter.year")}</dt>
            <dd>{work.year}</dd>
          </div>
          {solutions.length > 0 && (
            <div className={styles.metaItem}>
              <dt>{tLab("colSolutions")}</dt>
              <dd>{solutions.join(" · ")}</dd>
            </div>
          )}
          {director && (
            <div className={styles.metaItem}>
              <dt>{tLab("director")}</dt>
              <dd>
                {/* brief 20.3: her vaka sayfasında yönetmen adı Directors & Crew'a link olur */}
                <Link href={`/culture/directors/${director.slug}`} className={styles.inlineLink}>
                  {director.full_name}
                </Link>
              </dd>
            </div>
          )}
        </dl>
        {externalVideo && (
          <div className={styles.watch}>
            <Button href={externalVideo} variant="primary" size="sm" target="_blank" rel="noopener noreferrer">
              {tLab("watch")}
            </Button>
          </div>
        )}
      </PageIntro>

      {hasMedia && (
        <section data-ground="black" className={styles.mediaBand} aria-label={tLab("mediaRail")}>
          <CaseMedia
            cover={work.cover_image_url}
            video={directVideo}
            label={`${projectTitle} · ${clientLabel}`}
          />
        </section>
      )}

      {chapters.length > 0 && (
        <div data-ground="paper" className={styles.chapters}>
          {chapters.map((chapter) => (
            <section key={chapter.key} className={styles.chapter} aria-labelledby={`case-${chapter.key}`}>
              <h2 id={`case-${chapter.key}`} className={`lab-rail ${styles.chapterTitle}`}>
                {chapter.title}
              </h2>
              <Reveal className={styles.chapterBody}>
                <p className={chapter.key === "result" ? `lab-h2 ${styles.result}` : styles.text}>
                  {chapter.text}
                </p>
              </Reveal>
            </section>
          ))}
        </div>
      )}

      <section data-ground="paper" className={styles.chapter} aria-labelledby="case-evidence">
        <h2 id="case-evidence" className={`lab-rail ${styles.chapterTitle}`}>
          {t("case.evidence")}
        </h2>
        <div className={styles.chapterBody}>
          {/* TODO: brief 7.3 — "sayfanın %70'i görsel olacak". Film/fotoğraf/KV
              varlıkları Cloudflare R2'ye yüklendikten sonra bu ızgara gerçek
              görsellerle dolacak (next/image + sizes + lazy; video poster +
              preload="none"). Şemada galeri alanı henüz yok. */}
          <div className={styles.gallery} aria-hidden="true">
            <span className={styles.frame} data-shape="wide" />
            <span className={styles.frame} data-shape="tall" />
            <span className={styles.frame} data-shape="square" />
          </div>
          <p className={styles.pending} role="status">
            <span className={styles.pulse} aria-hidden="true" />
            {t("case.evidenceEmpty")}
          </p>
        </div>
      </section>

      {next ? (
        <nav data-ground="black" className={styles.next} aria-label={tLab("nextCase")}>
          <p className="lab-rail">{tLab("nextCase")}</p>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className={`lab-display ${styles.nextTitle}`}>
              {workTitle(next, locale, t("projectFallback"))}
              <span className={`lab-serif ${styles.nextClient}`}>
                {next.client_name ?? t("confidentialClient")}
              </span>
            </span>
            <span className={styles.nextArrow} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          <div className={styles.nextBack}>
            <Button href="/work" variant="ghost" size="sm">
              {tLab("allWork")}
            </Button>
          </div>
        </nav>
      ) : (
        <div data-ground="paper" className={styles.backOnly}>
          <Button href="/work" variant="ghost" size="sm">
            {tLab("allWork")}
          </Button>
        </div>
      )}
    </div>
  );
}
