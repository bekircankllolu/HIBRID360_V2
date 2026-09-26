import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { siteImages } from "@/data/site-images";
import { SERVICE_CATALOG } from "@/data/services";
import { CRYSTAL_MEDIA } from "@/data/solar-system";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import { LoopVideo } from "./_lab/LoopVideo";
import { ServiceDirectory, type ServiceDirectoryItem } from "./ServiceDirectory";
import styles from "./page.module.css";

/**
 * WWD-01/02 (nihai copy deck, Ağustos 2026) — What We Do hub sayfası.
 *
 * Hizmet sırası ve kapsamı `src/data/services.ts` içinde (tek veri kaynağı;
 * ana sayfa hizmet satırı ve mega menü de oradan). Başlıklar (hizmet adları)
 * iki dilde de İngilizce; tek satırlık tanımlar `whatWeDo.list` altında.
 *
 * LAB (monks.com What We Do dili) — bölüm sırası:
 *   1. PageIntro, pembe tema zemini: "Tek fikir, uçtan uca üretim." (el
 *      çizimi alt çizgi + serif ses; metin `whatWeDo.heroBody`'nin iki
 *      parçaya bölünmüş hali, `lab.whatWeDo.intro*`).
 *   2. Kağıt: kademeli kart ızgarası (ServiceDirectory).
 *   3. Siyah: dönen Hibrid taşı videosunun yanında "birlikte çalışmanın
 *      yolları" listesi (desen 9) — Service Production, How We Work,
 *      Solutions, Brief Builder. Tanım satırları bu sayfaların kendi meta
 *      açıklamalarıdır (yeni metin yok).
 *   4. Sayfa sonu çağrısı: layout'taki global CtaBand (sarı) — sayfaya
 *      ikinci bir sarı kapanış eklenmedi.
 * Partner/müşteri logo ızgarası YOK: sitede logo varlığı yok, uydurulmadı.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title.whatWeDo"),
    description:
      locale === "en"
        ? "Creative, production, post-production, digital, live broadcast, Cloud TV, events and AI creative production."
        : "Creative, prodüksiyon, post prodüksiyon, dijital, canlı yayın, Cloud TV, etkinlik ve AI kreatif prodüksiyon hizmetleri.",
    alternates: localizedAlternates(locale, "/what-we-do"),
  };
}

/** Desen 9 satırları: ad (özel ad, iki dilde İngilizce) + rota. */
const PATHS = [
  { key: "serviceProduction", name: "Service Production (International)", href: "/what-we-do/service-production" },
  { key: "howWeWork", name: "How We Work", href: "/what-we-do/how-we-work" },
  { key: "solutions", name: "Solutions", href: "/solutions" },
  { key: "brief", name: "Brief Builder", href: "/brief" },
] as const;

const serif = (chunks: ReactNode) => <span className="lab-serif">{chunks}</span>;

export default async function WhatWeDoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("whatWeDo");
  const tLab = await getTranslations("lab.whatWeDo");
  const descriptions = t.raw("list") as Array<{ title: string; body: string }>;
  const items: ServiceDirectoryItem[] = SERVICE_CATALOG.map((service) => {
    const image = service.imageKey ? siteImages.services[service.imageKey] : undefined;
    return {
      id: service.id,
      name: service.name,
      href: service.href,
      description: descriptions.find((item) => item.title === service.name)?.body ?? "",
      image: image ? { src: image.src, alt: image.alt[locale], focus: image.focus } : undefined,
    };
  });

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Do", path: "/what-we-do" },
        ])}
      />

      <PageIntro
        ground="pink"
        rail={t("heroTitle")}
        title={tLab.rich("introTitle", {
          serif,
          mark: (chunks) => (
            <Scribble shape="underline" tone="current" delay={350}>
              {chunks}
            </Scribble>
          ),
        })}
        lede={tLab("introLede")}
        actions={
          <Button variant="ghost" href="/what-we-do/how-we-work" lang="en">
            How We Work
          </Button>
        }
      />

      <div className={styles.directoryFrame} data-ground="paper">
        <ServiceDirectory
          items={items}
          rail={tLab("rail")}
          titleId="wwd-directory-title"
          title={tLab.rich("title", {
            mark: (chunks) => (
              <Scribble shape="circle" tone="fuchsia" delay={200}>
                {chunks}
              </Scribble>
            ),
          })}
        />
      </div>

      <section className={styles.paths} data-ground="black" aria-labelledby="wwd-paths-title">
        <div className={styles.pathsMedia} aria-hidden="true">
          <LoopVideo
            className={styles.pathsVideo}
            poster={CRYSTAL_MEDIA.poster}
            sources={[{ src: CRYSTAL_MEDIA.interactive, type: "video/mp4" }]}
          />
        </div>
        <div className={styles.pathsBody}>
          <h2 id="wwd-paths-title" className={`lab-rail ${styles.pathsRail}`}>
            {tLab("pathsTitle")}
          </h2>
          <ul className={styles.pathsList}>
            {PATHS.map((path, index) => (
              <Reveal as="li" key={path.key} delay={index * 90} className={styles.pathItem}>
                <Link href={path.href} className={styles.pathLink}>
                  <span className={styles.pathName} lang="en">
                    {path.name}
                  </span>
                  <span className={styles.pathArrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
                <p className={styles.pathBody}>{tLab(`paths.${path.key}`)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}
