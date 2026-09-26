import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { LegalShell } from "@/components/legal/LegalShell";
import {
  ACCESSIBILITY_COMMITMENT,
  ACCESSIBILITY_DONE,
  ACCESSIBILITY_FEEDBACK,
  ACCESSIBILITY_LAST_REVIEWED,
  knownLimitations,
} from "@/data/accessibility";
import type { Locale } from "@/i18n/routing";

/**
 * Accessibility Statement — brief-rev12.md Bölüm 18.10.
 * Metinler SİTEYE GİRECEK METİN kutusundan birebir; "Known limitations"
 * bölümü brief'in özel notu gereği dürüstçe dolduruldu (bkz.
 * src/data/accessibility.ts).
 *
 * LAB (monks policy sayfaları): yasal sayfalarla aynı `LegalShell`
 * iskeleti. Tek alt başlık olduğu için içindekiler çizilmez (LegalShell
 * ≥2 başlıkta çizer). Gözden geçirme tarihi varsa rail'de de durur.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer.legal" });
  return { title: t("accessibility") };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tLegal = await getTranslations("footer.legal");
  const tNav = await getTranslations("nav");
  const tLab = await getTranslations("lab.legal");
  const t = await getTranslations("accessibilityPage");
  const reviewed = ACCESSIBILITY_LAST_REVIEWED
    ? t("lastReviewed", { date: ACCESSIBILITY_LAST_REVIEWED })
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Accessibility Statement", path: "/accessibility" },
        ])}
      />
      <LegalShell
        rail={tNav("legal")}
        updated={reviewed}
        title={tLegal("accessibility")}
        tocLabel={tLab("toc")}
      >
        <p>{ACCESSIBILITY_COMMITMENT[locale]}</p>
        <p>{ACCESSIBILITY_DONE[locale]}</p>

        <h2 id="bilinen-sinirlamalar">{t("knownLimitations")}</h2>
        <ul>
          {knownLimitations.map((limitation) => (
            <li key={limitation.en}>{limitation[locale]}</li>
          ))}
        </ul>

        <p>{ACCESSIBILITY_FEEDBACK[locale]}</p>
        <p>{reviewed ?? t("reviewPending")}</p>
      </LegalShell>
    </>
  );
}
