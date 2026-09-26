import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceChapter, signatureReel } from "@/components/service-chapter/ServiceChapter";
import { hibridSolutions } from "@/data/hibrid-solutions";
import { serviceSignatureVideos } from "@/data/service-signature-videos";
import { siteImages } from "@/data/site-images";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Video Production Istanbul",
    description: locale === "en"
      ? "Commercials, product films and how-to content, shot end to end with an in-house crew. 20+ years of production experience."
      : "Reklam filmleri, ürün filmleri ve kullanım içerikleri; kurum içi ekiple uçtan uca çekim ve 20+ yıllık prodüksiyon deneyimi.",
    alternates: localizedAlternates(locale, "/what-we-do/production"),
  };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — sarı sayfa başı. */
export default async function ProductionPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.production");
  const tServices = await getTranslations("services");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const body = t.raw("body") as string[];
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Production")?.body ?? "";
  const photo = siteImages.services.production;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [
        { name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" },
        { name: "Production", path: "/what-we-do/production" },
      ])} />
      <ServiceChapter
        locale={locale}
        chapterId="production"
        ground="yellow"
        slogan="Pure. Simple. Powerful."
        lede={blurb}
        manifesto={body[0] ?? ""}
        manifestoRail={tr ? "Kadrajın içinde" : "Inside the frame"}
        body={body.slice(1)}
        services={SERVICE_OFFERINGS.production}
        reel={signatureReel(serviceSignatureVideos.production, tr ? "Kamera · lens · odak" : "Camera · lens · focus")}
        photo={{ src: photo.src, wideSrc: photo.wideSrc, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "rows",
            id: "crew",
            title: tr ? "Tek ekip. Tam akış." : "One crew. Full flow.",
            rows: hibridSolutions.map((line) => ({ body: tr ? line.tr : line.en })),
          },
          { kind: "pending", id: "evidence", title: tServices("evidenceTitle"), message: t("evidenceEmpty") },
        ]}
      />
    </>
  );
}
