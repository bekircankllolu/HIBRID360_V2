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
  return {
    title: "Post Production",
    description: locale === "en"
      ? "Editing, colour, sound, motion graphics, 3D and retouch — full-service post production in-house."
      : "Kurgu, renk, ses, hareketli grafik, 3D ve rötuş; kurum içinde uçtan uca post prodüksiyon.",
    alternates: localizedAlternates(locale, "/what-we-do/post-production"),
  };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — kağıt sayfa başı. */
export default async function PostProductionPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.postProduction");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const body = t.raw("body") as string[];
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Post Production")?.body ?? "";
  const photo = siteImages.services.postProduction;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [
        { name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" },
        { name: "Post Production", path: "/what-we-do/post-production" },
      ])} />
      <ServiceChapter
        locale={locale}
        chapterId="postProduction"
        ground="paper"
        slogan="Off we go!"
        lede={blurb}
        manifesto={body[0] ?? ""}
        manifestoRail={tr ? "Kurgu masası" : "The edit suite"}
        body={body.slice(1)}
        services={SERVICE_OFFERINGS.postProduction}
        reel={signatureReel(serviceSignatureVideos.postProduction, tr ? "Timeline · maske · renk" : "Timeline · mask · colour")}
        photo={{ src: photo.src, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "statement",
            id: "abby-singer",
            title: "Abby Singer shot!",
            titleLang: "en",
            body: t("microHeadingNote"),
          },
        ]}
      />
    </>
  );
}
