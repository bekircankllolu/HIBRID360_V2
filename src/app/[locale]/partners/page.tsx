import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { titleCase } from "@/components/culture/lab-text";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { breadcrumbListJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import shared from "@/styles/culture-page.module.css";
import partner from "./page.module.css";
import { PartnerRow } from "./PartnerRow";

/**
 * PAR-01..03 (nihai copy deck, Ağustos 2026) — Partners.
 *
 * 29 Ağustos 2026: canonical /partners (eski /culture/partners kalıcı
 * yönlendirme). PAR-02 [DOĞRULA]: alıntı mevcut sitede MOTIVE'ye
 * atfedilmiş; deck reklamcılıkta David Ogilvy'ye ait olduğunu belirtiyor
 * ama kesin doğrulama istiyor (TODO aşağıda). Eylül 2026: Studio Room ve
 * Marry Me Kitchen birlikte gösterilir; Marry Me Kitchen'ın onaylı
 * açıklaması yok — uydurulmaz, durum yazılır.
 *
 * LAB (monks.com dili): PageIntro (kağıt; slogan "Love is on the air",
 * iki dilde İngilizce) → partner ızgarası (kağıt; logo ızgarası deseni,
 * logo yerine geniş display ad) → Ogilvy alıntısı (pembe vurgu, serif; ardından global sarı CtaBand).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title.partners"),
    alternates: localizedAlternates(locale, "/partners"),
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("culture.partners");
  const tLab = await getTranslations("lab.culture.partners");
  const tCommon = await getTranslations("common");
  const partners = [
    {
      id: "studio-room",
      name: "STUDIO FOOD ROOM",
      body: t("partnerBody"),
      url: t("partnerUrl"),
    },
    {
      id: "marry-me-kitchen",
      name: "MARRY ME KITCHEN",
      body: null,
      url: null,
    },
  ] as const;

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Partners", path: "/partners" },
        ])}
      />

      <PageIntro
        rail={tLab("rail")}
        title={
          <span lang={locale === "tr" ? "en" : undefined}>
            <Scribble shape="circle" tone="fuchsia" delay={300}>
              Love
            </Scribble>{" "}
            is <span className="lab-serif">on the air.</span>
          </span>
        }
      />

      <Section wide ground="paper" rail={tLab("list")} className={partner.gridSection}>
        <ol className={partner.grid}>
          {partners.map((entry, index) => (
            <PartnerRow
              key={entry.id}
              order={index}
              index={String(index + 1).padStart(2, "0")}
              name={titleCase(entry.name, "en")}
              body={entry.body}
              url={entry.url}
              pendingLabel={tCommon("pendingLabel")}
              visitLabel={tLab("visit")}
            />
          ))}
        </ol>
      </Section>

      {/* TODO: PAR-02 [DOĞRULA] — David Ogilvy atfı yayına girmeden önce
          doğrulanmalı (deck kendi belirsizliğini not düşüyor). */}
      <Section ground="pink" rail={tLab("onPartnership")}>
        <figure className={partner.quote}>
          <blockquote className={shared.statement}>{t("quote")}</blockquote>
          <figcaption className={shared.attribution}>{t("quoteAuthor")}</figcaption>
        </figure>
      </Section>
    </div>
  );
}
