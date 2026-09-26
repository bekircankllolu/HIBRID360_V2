import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { CulturePending } from "@/components/culture/CulturePending";
import { sentenceCase } from "@/components/culture/lab-text";
import { ClientNameIndex } from "@/components/friends/ClientNameIndex";
import { AnniversaryMark } from "@/components/friends/AnniversaryMark";
import { CrownReveal } from "@/components/friends/CrownReveal";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { Button } from "@/components/ui/Button";
import { getPublishedTestimonials } from "@/lib/content";
import { clients, newClients, SHOW_NEW_CLIENTS } from "@/data/clients";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * FRD-01..04 (nihai copy deck, Ağustos 2026) — Clients (deck'teki adı:
 * Friends).
 *
 * 29 Ağustos 2026: görünür ad ve canonical rota Clients; /friends kalıcı
 * olarak buraya yönlendiriliyor (next.config.mjs).
 *
 * İÇERİK ÇELİŞKİSİ (açık, müşteriye sorulacak): deck'in gövde metni
 * "onlara müşteri değil, dost diyoruz" diyor — sayfanın adı Clients olunca
 * cümle kendi kendisiyle çelişiyor. Onaylı metin silinmedi, yerine metin
 * uydurulmadı; çelişki docs/content/CURRENT_CONTENT_GAPS.md'de blocker.
 *
 * FRD-03 [KARAR] kapatıldı (docs/DECISIONS.md #30): `newClients`
 * `SHOW_NEW_CLIENTS` true iken render ediliyor. `verified: false` isimler
 * hâlâ listelenmez (CURRENT_CONTENT_GAPS.md #5).
 *
 * Müşteri sözleri (brief 18.7): yalnız yazılı onaylı ve yayınlanmış
 * kayıtlar; veri yoksa dürüst bekleme durumu. Uydurma alıntı yok.
 *
 * LAB (monks.com dili) — zemin ritmi:
 *   PageIntro (kağıt; "Thank you" + serif teşekkür cümlesi)
 *   → taç sahnesi (siyah; kaydırmaya bağlı film — tek büyük hareket anı)
 *   → yıl dönümü + dost sayısı (siyah, filmin devamı)
 *   → marka dizini (kağıt; sayaç + alfabetik süzgeç + isim ızgarası)
 *   → müşteri sözleri (kağıt; editoryal serif satırlar)
 *   → Work çağrısı (kağıt; hemen ardından global sarı CtaBand geliyor).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title.clients"),
    description:
      locale === "en"
        ? "The brands we work with — from holdings and global appliance brands to hotels, restaurants and start-ups."
        : "Birlikte çalıştığımız markalar: holdinglerden global beyaz eşya markalarına, otellerden restoranlara ve girişimlere.",
    alternates: localizedAlternates(locale, "/clients"),
  };
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("clients");
  const tLab = await getTranslations("lab.culture.friends");
  const tCommon = await getTranslations("common");
  const testimonials = await getPublishedTestimonials();

  // Yalnızca yazımı doğrulanmış isimler yayına girer (deck [DOĞRULA]).
  const publishableClients = clients.filter((client) => client.verified);
  /* Dizinin TAM listesi tek yerde kuruluyor: yıl dönümü bölümündeki sayı
     ile isim dizini aynı diziden besleniyor, ayrışamazlar. */
  const indexedClients = [
    ...publishableClients,
    ...(SHOW_NEW_CLIENTS ? newClients.map((name) => ({ name, verified: true })) : []),
  ];
  const friendsCount = indexedClients.length;
  const english = locale === "tr" ? "en" : undefined;
  const hasTestimonials = testimonials.some(
    (item) => item.written_consent_confirmed && (item.placement ?? []).includes("friends"),
  );

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Clients", path: "/clients" },
        ])}
      />

      <PageIntro
        rail={<span lang={english}>Friends since 2004</span>}
        title={
          <>
            <span lang={english}>
              <Scribble shape="circle" tone="fuchsia" delay={300}>
                {t("heroTitle")}
              </Scribble>
            </span>
            <br />
            <span className="lab-serif">{t("heroSupport")}</span>
          </>
        }
        lede={t("heroBody")}
      />

      <CrownReveal />

      <section data-ground="black" className={styles.anniversary} aria-labelledby="friends-champions">
        <p className={`lab-rail ${styles.anniversaryRail}`} lang={english}>
          2004 → today
        </p>
        <div className={styles.anniversaryMark}>
          <AnniversaryMark label={t("anniversaryAlt")} />
        </div>
        <div className={styles.anniversaryCopy}>
          <h2 id="friends-champions" className="lab-h2" lang={english}>
            Work with the champions
          </h2>
          <p className={styles.anniversaryBody}>{t("friendsBody")}</p>
          <p className={styles.count}>
            <span className={styles.countValue}>{friendsCount}</span>
            <span className={styles.countLabel}>{sentenceCase(t("friendsCountLabel"), locale)}</span>
          </p>
        </div>
      </section>

      <ClientNameIndex clients={indexedClients} />

      <Section ground="paper" rail={t("testimonialsTitle")} className={styles.testimonials}>
        {/* brief 18.7: hedef yayına girmeden en az 3 videolu, 6 yazılı söz.
            Yayın izni kontrolü veritabanında (written_consent_confirmed). */}
        {hasTestimonials ? (
          <TestimonialList testimonials={testimonials} locale={locale} placement="friends" />
        ) : (
          <CulturePending label={tCommon("pendingLabel")} message={t("testimonialsEmpty")} />
        )}
      </Section>

      {/* FRD-04 — WORK üst menüde yok; bu bağlantı onun ana giriş noktalarından biri. */}
      <Section ground="paper" rail={<span lang={english}>Work</span>} className={styles.cta}>
        <p className={`lab-display ${styles.ctaLead}`}>{t("ctaLead")}</p>
        <div className={styles.ctaActions}>
          <Button href="/work">{tLab("seeWork")}</Button>
        </div>
      </Section>
    </div>
  );
}
