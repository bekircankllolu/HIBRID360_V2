import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { BriefBuilder } from "@/components/brief/BriefBuilder";
import { ScribbleArrow } from "@/components/lab/Scribble";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import styles from "./page.module.css";

// brief-rev12.md Bölüm 18.8 — Brief Builder. URL: /tr/brief · /en/brief
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Brief Builder",
    description:
      locale === "en"
        ? "Six questions, about two minutes. You’ll get the summary in your inbox, and so will we."
        : "Altı soru, yaklaşık iki dakika. Özeti hem size hem bize göndereceğiz.",
    alternates: localizedAlternates(locale, "/brief"),
  };
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("brief");

  return (
    // LAB: kağıt zemin (data-ground) — balonlar ve alanlar zemine duyarlı.
    <div className={styles.page} data-ground="paper">
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Brief Builder", path: "/brief" },
        ])}
      />
      {/* LAB (monks.com): solda görünür sayfa başlığı, sağda sohbet. h1
          BriefBuilder'ın dışında: adım/özet/gönderim durumlarının hepsinde
          sabit kalır (tekil başlık, SEO + erişilebilirlik). Açılış metni
          artık sohbetin ilk balonu, başlıkla yarışmıyor. */}
      <header className={styles.intro}>
        <h1 className={styles.title}>{t("pageTitle")}</h1>
        <ScribbleArrow tone="current" className={styles.arrow} />
      </header>
      <BriefBuilder locale={locale} />
    </div>
  );
}
