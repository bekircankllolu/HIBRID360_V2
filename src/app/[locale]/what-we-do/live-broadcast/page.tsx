import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceChapter, signatureReel } from "@/components/service-chapter/ServiceChapter";
import { serviceSignatureVideos } from "@/data/service-signature-videos";
import { siteImages } from "@/data/site-images";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: "Corporate Live Broadcast", description: locale === "en" ? "Multi-camera live streaming for events, conventions and medical broadcasts — with satellite uplink and remote production." : "Etkinlik, kongre ve medikal yayınlar için çok kameralı canlı yayın; uydu bağlantısı ve uzaktan prodüksiyon desteğiyle.", alternates: localizedAlternates(locale, "/what-we-do/live-broadcast") };
}

/** LAB: monks hizmet sayfası şablonu (ServiceChapter) — sarı sayfa başı. */
export default async function LiveBroadcastPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const t = await getTranslations("services.liveBroadcast");
  const tServices = await getTranslations("services");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const body = t.raw("body") as string[];
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const blurb = list.find((item) => item.title === "Live Broadcast")?.body ?? "";
  const photo = siteImages.services.liveBroadcast;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, [{ name: "Home", path: "" }, { name: "What We Do", path: "/what-we-do" }, { name: "Live Broadcast", path: "/what-we-do/live-broadcast" }])} />
      <ServiceChapter
        locale={locale}
        chapterId="liveBroadcast"
        ground="yellow"
        slogan="Live is the hardest format. It’s our favourite."
        lede={blurb}
        manifesto={body[0] ?? ""}
        manifestoRail={tr ? "Şimdi yayında" : "On air now"}
        body={body.slice(1)}
        services={SERVICE_OFFERINGS.liveBroadcast}
        reel={signatureReel(serviceSignatureVideos.liveBroadcast, tr ? "Anten · sinyal · dağıtım" : "Antenna · signal · feed")}
        photo={{ src: photo.src, alt: photo.alt[locale], focus: photo.focus }}
        details={[
          {
            kind: "statement",
            id: "signal",
            title: tr ? "Yayın devam ediyor" : "The signal continues",
            body: (
              <>
                {t("cloudBody")} <Link href="/what-we-do/cloud-tv">→ {t("cloudLink")}</Link>
              </>
            ),
          },
          { kind: "pending", id: "evidence", title: tServices("evidenceTitle"), message: t("evidenceEmpty") },
        ]}
      />
    </>
  );
}
