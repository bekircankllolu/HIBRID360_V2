import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { ServiceChapter, signatureReel } from "@/components/service-chapter/ServiceChapter";
import { hibridSolutions } from "@/data/hibrid-solutions";
import { serviceSignatureVideos } from "@/data/service-signature-videos";
import { siteImages } from "@/data/site-images";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: "Cloud TV & Corporate Channel", description: locale === "en" ? "Your own corporate TV channel on a cloud portal: content, infrastructure, training and turnkey operation." : "Bulut portal üzerinde kendi kurumsal TV kanalınız: içerik, altyapı, eğitim ve anahtar teslim operasyon.", alternates: localizedAlternates(locale, "/what-we-do/cloud-tv") };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — kağıt sayfa başı. */
export default async function CloudTvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.cloudTv");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const steps = t.raw("steps") as string[];
  const bandBody = t.raw("bandBody") as string[];
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Cloud TV")?.body ?? "";
  const photo = siteImages.services.cloudTv;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [{ name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" }, { name: "Cloud TV", path: "/what-we-do/cloud-tv" }])} />
      <ServiceChapter
        locale={locale}
        chapterId="cloudTv"
        ground="paper"
        slogan="There is no time like right now."
        lede={blurb}
        manifesto={t("body")}
        manifestoRail={tr ? "Her ekranda" : "On every screen"}
        body={bandBody}
        services={SERVICE_OFFERINGS.cloudTv}
        reel={signatureReel(serviceSignatureVideos.cloudTv, tr ? "Bulut · yayın · cihaz" : "Cloud · stream · device")}
        photo={{ src: photo.src, wideSrc: photo.wideSrc, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "rows",
            id: "three-moves",
            title: tr ? "Üç adımda yayın" : "Broadcast in three moves",
            rows: steps.map((step) => ({ body: step })),
          },
          {
            kind: "rows",
            id: "solutions",
            title: t.rich("solutionsTitle", { brand: (chunks) => <span lang="en">{chunks}</span> }),
            rows: hibridSolutions.slice(0, 3).map((line) => ({ body: tr ? line.tr : line.en })),
          },
        ]}
      />
    </>
  );
}
