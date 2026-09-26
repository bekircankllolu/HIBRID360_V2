import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { ServiceChapter, signatureReel } from "@/components/service-chapter/ServiceChapter";
import { serviceSignatureVideos } from "@/data/service-signature-videos";
import { siteImages } from "@/data/site-images";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: "Event Management", description: locale === "en" ? "Conventions, launches, roadshows and brand events — concept, production and on-site execution." : "Kongre, lansman, roadshow ve marka etkinliklerinde konsept, prodüksiyon ve saha uygulaması.", alternates: localizedAlternates(locale, "/what-we-do/event-management") };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — pembe sayfa başı. */
export default async function EventManagementPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.eventManagement");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const body = t.raw("body") as string[];
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Event Management")?.body ?? "";
  const photo = siteImages.services.eventManagement;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [{ name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" }, { name: "Event Management", path: "/what-we-do/event-management" }])} />
      <ServiceChapter
        locale={locale}
        chapterId="eventManagement"
        ground="pink"
        slogan="We design experience."
        lede={blurb}
        // İddia: gövdenin kısa ikinci maddesi; diğer iki madde okunur metinde.
        manifesto={body[1] ?? ""}
        manifestoRail={tr ? "Sahne açılıyor" : "The stage opens"}
        body={[body[0], ...body.slice(2)].filter(Boolean)}
        services={SERVICE_OFFERINGS.eventManagement}
        reel={signatureReel(serviceSignatureVideos.eventManagement, tr ? "Truss · ışık · plan" : "Truss · light · plan")}
        photo={{ src: photo.src, wideSrc: photo.wideSrc, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "statement",
            id: "reason",
            title: "Reason to meet us",
            titleLang: "en",
            body: "Call us · trust us · love us",
            bodyLang: "en",
          },
        ]}
      />
    </>
  );
}
