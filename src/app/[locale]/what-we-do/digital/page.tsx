import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { ServiceChapter, signatureReel } from "@/components/service-chapter/ServiceChapter";
import { digitalServices } from "@/data/digital-services";
import { serviceSignatureVideos } from "@/data/service-signature-videos";
import { siteImages } from "@/data/site-images";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Digital Content Production",
    description: locale === "en" ? "Social-first content, short-form video, CGI and AI-powered production built to perform across platforms." : "Platformlar genelinde performans için tasarlanan sosyal medya öncelikli içerik, kısa video, CGI ve yapay zekâ destekli prodüksiyon.",
    alternates: localizedAlternates(locale, "/what-we-do/digital"),
  };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — pembe sayfa başı. */
export default async function DigitalPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.digital");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const body = t.raw("body") as string[];
  const bandBody = t.raw("bandBody") as string[];
  const quad = t.raw("quad") as Array<{ title: string; body: string }>;
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Digital")?.body ?? "";
  const photo = siteImages.services.digital;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [{ name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" }, { name: "Digital", path: "/what-we-do/digital" }])} />
      <ServiceChapter
        locale={locale}
        chapterId="digital"
        ground="pink"
        slogan="Built for the feed. Made to move."
        lede={blurb}
        manifesto={bandBody[0] ?? ""}
        manifestoRail={tr ? "Akışın içinde" : "Inside the feed"}
        body={[...body, ...bandBody.slice(1)]}
        services={SERVICE_OFFERINGS.digital}
        reel={signatureReel(serviceSignatureVideos.digital, tr ? "İmleç · ızgara · ağ" : "Cursor · grid · network")}
        photo={{ src: photo.src, wideSrc: photo.wideSrc, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "rows",
            id: "content-system",
            title: tr ? "İçerik sistemi" : "Content system",
            rows: digitalServices.map((service) => ({
              title: service.title,
              titleLang: "en",
              body: tr ? service.tr : service.en,
            })),
          },
          {
            kind: "rows",
            id: "four-moves",
            title: tr ? "Dört hareket" : "Four moves",
            rows: quad.map((item) => ({ title: item.title, titleLang: "en", body: item.body })),
          },
          {
            kind: "statement",
            id: "build",
            title: "Let’s build your own digital experience.",
            titleLang: "en",
            body: t("closingBody"),
          },
        ]}
      />
    </>
  );
}
