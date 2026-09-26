import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { CulturePending } from "@/components/culture/CulturePending";
import { initialsOf } from "@/components/culture/DirectorCards";
import { Reveal } from "@/components/lab/Reveal";
import { Section } from "@/components/lab/Section";
import { breadcrumbListJsonLd } from "@/lib/schema";
import {
  getDirectorBySlug,
  getPublishedDirectors,
  getPublishedWorks,
} from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * brief-rev12.md Bölüm 20.3 — yönetmen profili şablonu:
 * ad · rol · tek satır tanım · biyografi (3-4 cümle) · reel (60-90 sn) ·
 * selected work (4 iş, Works'e link) · şehir/dil.
 *
 * TODO: docs/DECISIONS.md #14 bekleniyor — kadro listesi ve çekim tarihi
 * gelmeden hiçbir profil yayınlanmıyor, generateStaticParams boş dönüyor.
 *
 * LAB (monks.com dili): dev ad (geniş display) + rol + serif tanım (kağıt)
 * → portre + biyografi (siyah) → reel (kağıt) → seçilmiş işler satır
 * listesi (kağıt) → şehir / dil / çalışma biçimi künyesi.
 */

export async function generateStaticParams() {
  const directors = await getPublishedDirectors();
  return directors.flatMap((director) =>
    routing.locales.map((locale) => ({ locale, slug: director.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const director = await getDirectorBySlug(slug);
  if (!director) return {};

  const oneLiner =
    (locale === "tr" ? director.one_liner_tr : director.one_liner_en) ?? undefined;

  return {
    title: director.full_name,
    description: oneLiner,
    alternates: localizedAlternates(locale, `/culture/directors/${slug}`),
  };
}

export default async function DirectorProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const director = await getDirectorBySlug(slug);

  if (!director) {
    notFound();
  }

  const t = await getTranslations("directors");
  const tLab = await getTranslations("lab.culture.directors");
  const tCommon = await getTranslations("common");
  const isTr = locale === "tr";
  const bio = isTr ? director.bio_tr : director.bio_en;
  const oneLiner = isTr ? director.one_liner_tr : director.one_liner_en;

  const allWorks = await getPublishedWorks();
  // brief 20.3: "Selected work: 4 iş, Works sayfasına link"
  const selectedWorks = allWorks
    .filter((work) => work.director_id === director.id)
    .slice(0, 4);

  const facts = [
    director.city ? { label: tLab("city"), value: director.city } : null,
    director.languages?.length ? { label: tLab("languages"), value: director.languages.join(", ") } : null,
    // brief 20.3 uygulama notu: serbest çalışanlar için "kadromuzda"
    // yerine "birlikte çalıştığımız" ayrımı yapılmalı.
    { label: tLab("relation"), value: t(`relationship.${director.relationship_type}`) },
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <article className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Culture", path: "/culture" },
          { name: "Directors & Crew", path: "/culture/directors" },
          { name: director.full_name, path: `/culture/directors/${slug}` },
        ])}
      />

      <header className={styles.header} data-ground="paper">
        <div className={styles.headerRail}>
          <Link href="/culture/directors" className={styles.back}>
            <span aria-hidden="true">←</span> {tLab("back")}
          </Link>
          <p className="lab-rail">{director.role}</p>
        </div>
        <div>
          <h1 className={styles.name}>{director.full_name}</h1>
          {oneLiner ? <p className={`${shared.statement} ${styles.oneLiner}`}>{oneLiner}</p> : null}
        </div>
      </header>

      <section data-ground="black" className={styles.portraitBand} aria-label={tLab("bio")}>
        <div className={styles.portrait}>
          {director.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Supabase/Cloudflare Images URL'i.
            <img src={director.photo_url} alt={director.full_name} className={styles.photo} decoding="async" />
          ) : (
            <span className={styles.initials} aria-hidden="true">
              {initialsOf(director.full_name, locale)}
            </span>
          )}
        </div>
        <div className={styles.bioColumn}>
          <p className="lab-rail">{tLab("bio")}</p>
          {bio ? <p className={styles.bio}>{bio}</p> : null}
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section ground="paper" rail={t("reel")}>
        {/* TODO: brief 20.3 — reel 60-90 sn. Video varlığı R2'ye yüklenince
            poster + preload="none" ile bağlanacak (CLAUDE.md perf bütçesi). */}
        <CulturePending label={tCommon("pendingLabel")} message={t("reelEmpty")} />
      </Section>

      {selectedWorks.length > 0 && (
        <Section ground="paper" rail={t("selectedWork")} className={styles.follow}>
          <ul className={styles.works}>
            {selectedWorks.map((work, index) => (
              <Reveal as="li" key={work.id} delay={index * 70}>
                <Link href={`/work/${work.slug}`} className={styles.workRow}>
                  <span className={styles.workClient}>
                    {work.client_name ?? t("confidentialClient")}
                  </span>
                  <span className={styles.workYear}>{work.year}</span>
                  <span className={styles.workArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
