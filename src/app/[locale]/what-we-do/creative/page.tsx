import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { CREATIVE_FILMS } from "@/data/service-films";
import { siteImages } from "@/data/site-images";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceChapter, type ServiceReelBlock } from "@/components/service-chapter/ServiceChapter";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

/**
 * Creative — LAB: diğer altı hizmet sayfasıyla aynı monks şablonuna
 * (ServiceChapter) geçti; pembe sayfa başı.
 *
 * Film: sayfanın tek filmi Sequin Tide (Seedance, sessiz, döngülü) — AI
 * etiketi filmin altında. Eski imza parçaları (CreativeTitle scramble,
 * DnaHelix, CreativeArchive, MonaShard/MonaDrift) bu şablonda kullanılmıyor;
 * dosyaları yerinde.
 *
 * TODO: CRE-04 — kampanya görselleri, KV'ler, outdoor/billboard işleri,
 * logolar ve brand ID çalışmaları (DEC #16 Works envanteri bekleniyor).
 * Gelene kadar dürüst "hazırlanıyor" satırı gösterilir.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Creative",
    description:
      locale === "en"
        ? "Brand thinking, concept and campaign ideas — from strategy to key visual and packaging."
        : "Marka düşüncesi, konsept ve kampanya fikirleri; stratejiden ana görsele ve ambalaja uzanan kreatif çözümler.",
    alternates: localizedAlternates(locale, "/what-we-do/creative"),
  };
}

export default async function CreativePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("services.creative");
  const tNav = await getTranslations("nav");
  const tVideo = await getTranslations("video");
  const body = t.raw("body") as string[];
  const photo = siteImages.services.creative;
  const film = CREATIVE_FILMS.sequinTide;

  const reel: ServiceReelBlock =
    film && film.kind === "video"
      ? {
          sources: film.sources,
          poster: film.poster.src,
          width: film.poster.width,
          height: film.poster.height,
          loop: true,
          label: film.alt[locale],
          caption: "Sequin Tide",
          note: tVideo("aiGenerated"),
        }
      : {
          sources: [],
          poster: photo.src,
          width: 2400,
          height: 1600,
          loop: false,
          label: photo.alt[locale],
          caption: "Creative",
        };

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Do", path: "/what-we-do" },
          { name: "Creative", path: "/what-we-do/creative" },
        ])}
      />
      <ServiceChapter
        locale={locale}
        chapterId="creative"
        ground="pink"
        slogan="Creativity without limits."
        lede={t("heroSubtitle")}
        manifesto={body.join(" ")}
        body={[]}
        services={SERVICE_OFFERINGS.creative}
        reel={reel}
        photo={{ src: photo.src, wideSrc: photo.wideSrc, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          { kind: "statement", id: "dna", title: t("band"), titleLang: "en" },
          {
            kind: "pending",
            id: "gallery",
            title: tNav("work"),
            message: t("galleryEmpty"),
            link: { href: "/work?service=Creative", label: tNav("work") },
          },
        ]}
      />
    </>
  );
}
