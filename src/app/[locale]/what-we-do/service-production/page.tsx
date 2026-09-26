import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/EmptyState";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/data/contact";
import { serviceProductionOffer } from "@/data/service-production";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { localizedAlternates } from "@/lib/site";
import { ClosingCall } from "../_lab/ClosingCall";
import { LocalTime } from "../_lab/LocalTime";
import lab from "../_lab/lab.module.css";
import styles from "./page.module.css";

/**
 * brief-rev12.md Bölüm 20.4 — Service Production (International).
 *
 * Öncelikli dil İngilizce: hedef kitle Türkiye'de çekim yapmak isteyen
 * yabancı ajans, yapımcı ve marka. Rota iki locale'de de var (hreflang),
 * içerik İngilizce kalıyor, TR sürümde başa bunu açıklayan kısa not düşüyor.
 *
 * TODO: brief 20.4 uygulama notu — teşvik (nakit iade) oranları değişkendir.
 * Sayfada hiçbir oran yazılmadı; brief'in güvenli ifadesi kullanıldı.
 *
 * LAB (monks.com kurumsal hizmet + Connect dili) — bölüm sırası:
 *   1. PageIntro (kağıt): başlık cümle düzeninde, ikinci cümle serif ses,
 *      "Türkiye" el çizimi alt çizgili; giriş + teklif butonu.
 *   2. Kağıt: "What we provide" — numaralı satır listesi, başlık kalın sans
 *      + açıklama serif devam (desen 4).
 *   3. Siyah: merkez ofis satırı — şehir, yerel saat, adres (desen 11,
 *      monks Connect ofis listesi). Tek ofis: uydurma lokasyon yok.
 *   4. Kağıt: kanıt (boş durum — liste hazırlanıyor) + teklif kapanışı.
 *   Sayfa sonu çağrısı layout'taki global CtaBand (sarı).
 * Metin değişmedi; yalnız büyük harf başlık cümle düzenine indi.
 */

const LEAD = "Locations, permits, crew, gear and post — one contact, one contract, one country.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Service Production (International)",
    description:
      locale === "en"
        ? "Locations, permits, crew, gear and post — one contact, one contract, one country."
        : "Mekân, izin, ekip, ekipman ve post prodüksiyon; tek muhatap ve tek sözleşmeyle Türkiye’de servis prodüksiyonu.",
    alternates: localizedAlternates(locale, "/what-we-do/service-production"),
  };
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

export default async function ServiceProductionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("serviceProduction");
  const tLab = await getTranslations("lab.serviceProduction");
  const tCta = await getTranslations("cta");
  // Görünür sol etiket aynı metnin görsel kopyası; başlık ekran okuyucuya
  // `srOnly` h2 olarak bir kez okunur.

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "What We Do", path: "/what-we-do" },
          {
            name: "Service Production (International)",
            path: "/what-we-do/service-production",
          },
        ])}
      />

      <PageIntro
        rail={<span lang="en">Service Production (International)</span>}
        title={
          <span lang="en">
            Shoot in{" "}
            <Scribble shape="underline" tone="fuchsia" delay={300}>
              Türkiye.
            </Scribble>{" "}
            <span className="lab-serif">With a crew that already knows the way.</span>
          </span>
        }
        lede={<span lang="en">{LEAD}</span>}
        actions={
          <Button href="/brief" lang="en">
            Get a production quote
          </Button>
        }
      >
        {locale === "tr" && <p className={styles.localeNote}>{t("localeNote")}</p>}
      </PageIntro>

      <Section rail={<span aria-hidden="true">{tLab("offerRail")}</span>} ground="paper" labelledBy="sp-offer-title" className={styles.offer}>
        <h2 id="sp-offer-title" className="srOnly">
          {tLab("offerRail")}
        </h2>
        <ol className={lab.rows} lang="en">
          {serviceProductionOffer.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 60} className={lab.row}>
              <span className={lab.rowIndex}>{pad(index)}</span>
              <h3 className={lab.rowText}>
                <strong>{item.title}</strong> <span className={lab.rowSerif}>{item.body}</span>
              </h3>
            </Reveal>
          ))}
        </ol>
      </Section>

      <section className={styles.base} data-ground="black" aria-labelledby="sp-base-title">
        <h2 id="sp-base-title" className={`lab-rail ${styles.baseRail}`}>
          {tLab("baseRail")}
        </h2>
        <div className={styles.office}>
          <p className={styles.officeTime}>
            <span className="lab-meta">{tLab("localTime")}</span>
            <LocalTime timeZone="Europe/Istanbul" locale={locale} />
          </p>
          <p className={styles.officeCity}>{CONTACT.addressLocality}</p>
          <address className={styles.officeAddress}>
            <span className="lab-meta">{tLab("address")}</span>
            {CONTACT.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <Link href="/contact" className={styles.officeLink}>
            <span className="srOnly">{tCta("contact")}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Section rail={<span aria-hidden="true">{t("evidenceTitle")}</span>} ground="paper" labelledBy="sp-evidence-title" className={styles.evidence}>
        <h2 id="sp-evidence-title" className="srOnly">
          {t("evidenceTitle")}
        </h2>
        {/* TODO: brief 20.4 — "Kanıt satırı şart: daha önce hangi ülkelerden
            hangi yapımlara hizmet verildi — yoksa sayfa iddia olarak kalır."
            Supabase `works` tablosunda ülke/servis-prodüksiyon alanı yok,
            envanterle birlikte (DECISIONS #16) şema da genişletilmeli. */}
        <EmptyState message={t("evidenceEmpty")} align="start" />
      </Section>

      <ClosingCall
        ground="paper"
        id="sp-closing-title"
        lang="en"
        rail={tLab("closingRail")}
        title="Send us the treatment and the shoot window."
        lede="You get a local budget within two working days."
        actions={
          <Button href="/brief" lang="en">
            Get a production quote
          </Button>
        }
      />
    </div>
  );
}
