import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import styles from "./page.module.css";

/**
 * Solutions — 29 Ağustos 2026 müşteri revizyonuyla üst menüye dönen sayfa.
 *
 * İçerik kaynağı: eski hibrid360.com/solutions. O sayfa bir kapak başlığı
 * ("Solutions" + "More And More") ve on beş yetenek kutucuğundan
 * oluşuyordu — gövde paragrafı yoktu. Buraya da yalnızca o on beş madde
 * alındı; eski sayfada olmayan bir giriş metni **uydurulmadı**. Müşteriden
 * bir tanım paragrafı gelirse eklenecek (bkz.
 * docs/content/CURRENT_CONTENT_GAPS.md).
 *
 * Maddelerin TR karşılıkları doğrudan çeviridir; yeni hizmet veya iddia
 * eklenmedi, sıra eski sayfadakiyle birebir aynıdır.
 *
 * "Photo Shooting" listede duruyor: Photography bağımsız hizmet sayfası
 * olmaktan çıktı ama bir yetenek olarak eski sitede de burada
 * listeleniyordu (bkz. docs/DECISIONS.md #17).
 *
 * LAB (monks): kağıt zeminde PageIntro (rail = eski kapağın "More And
 * More" satırı, dev dar başlık + el çizimi alt çizgi, altında sayaç), ardından
 * siyah zeminde büyük satır listesi (monks "karanlık üstünde hizmet
 * listesi"). Maddeler bağlantı DEĞİL — her yeteneğin kendi sayfası yok ve
 * olmayan bir hedefe link uydurulmadı; bu yüzden hover göstergesi yok.
 * e2e sözleşmesi: `main li` = 15 (sayfada başka `li` yok).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
  // Sayfa başlığı locale'e bağlı: TR sekmesinde/arama sonucunda İngilizce
  // başlık çıkıyordu. Görünür sayfa terminolojisiyle aynı sözlükten
  // (meta.title) okunuyor; alternates/canonical yapısı değişmedi.
    title: t("title.solutions"),
    description:
      locale === "en"
        ? "Brand consultancy, advertising, print, packaging, outdoor, web, digital, TVC, events, live broadcast, shooting, post-production and Cloud TV."
        : "Marka danışmanlığı, reklam, basılı işler, ambalaj, açık hava, web, dijital, TVC, etkinlik, canlı yayın, çekim, post prodüksiyon ve Cloud TV.",
    alternates: localizedAlternates(locale, "/solutions"),
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("solutions");
  const tLab = await getTranslations("lab.solutions");
  const items = t.raw("items") as string[];

  return (
    // <main> layout'ta zaten var (#main-content) — burada tekrarlanmaz.
    <>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />

      <PageIntro
        // Eski sayfanın kendi üst başlığı; marka dili, iki dilde de İngilizce.
        rail={<span lang="en">{t("heroKicker")}</span>}
        title={
          <Scribble shape="underline" tone="fuchsia">
            {t("heroTitle")}
          </Scribble>
        }
        lede={tLab("count", { count: items.length })}
      />

      <section className={styles.list} data-ground="black" aria-labelledby="solutions-list">
        <h2 id="solutions-list" className={`lab-rail ${styles.listTitle}`}>
          {t("listTitle")}
        </h2>
        <ul className={styles.rows}>
          {items.map((item, index) => (
            <Reveal as="li" key={item} delay={Math.min(index, 6) * 50} className={styles.row}>
              <span className={`lab-meta ${styles.index}`} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.label}>{item}</span>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
