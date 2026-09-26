import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkInventory } from "@/components/work/WorkInventory";
import type { Locale } from "@/i18n/routing";
import { getPublishedWorks } from "@/lib/content";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const works = await getPublishedWorks();
  return {
    // Sayfa başlığı locale'e bağlı: TR sekmesinde/arama sonucunda İngilizce
    // başlık çıkıyordu. Görünür sayfa terminolojisiyle aynı sözlükten
    // (meta.title) okunuyor; alternates/canonical yapısı değişmedi.
    title: t("title.work"),
    description:
      locale === "en"
        ? "Selected films, campaigns and live productions by Hibrid 360."
        : "Hibrid 360’ın seçili film, kampanya ve canlı prodüksiyon işleri.",
    robots: works.length > 0 ? undefined : { index: false, follow: true },
    alternates: localizedAlternates(locale, "/work"),
  };
}

/**
 * LAB — monks.com "work inventory" düzeni, `paper` tabanlı tema sistemiyle.
 *
 *   PageIntro (paper)  sol etiket + konuşan başlık, el çizimi alt çizgi, serif son satır
 *   WorkInventory      sayaç + Filtreler → öne çıkan 3 kart → Müşteri | Proje | Hizmetler
 *   (sayfa sonu çağrısı layout'taki sarı CtaBand — burada ikinci bir kapanış yok)
 *
 * Başlık, brief 7.1'in showreel altı gövde metni. `WorkHeroFilm` ve
 * `TeamBand` dosyaları duruyor (monks envanter sayfası tipografiyle
 * açılıyor, üstte medya yok).
 */
export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  const { service } = await searchParams;
  const t = await getTranslations("work");
  const tLab = await getTranslations("lab.works");
  const works = await getPublishedWorks();

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Work", path: "/work" },
        ])}
      />

      <PageIntro
        rail={tLab("eyebrow")}
        title={tLab.rich("title", {
          mark: (chunks) => (
            <span className={styles.mark}>
              <Scribble shape="underline" tone="current" delay={250}>
                {chunks}
              </Scribble>
            </span>
          ),
          serif: (chunks) => <span className={`lab-serif ${styles.serif}`}>{chunks}</span>,
        })}
      />

      <div data-ground="paper">
        <WorkInventory
          works={works}
          locale={locale}
          confidentialLabel={t("confidentialClient")}
          initialService={service}
        />
      </div>
    </div>
  );
}
