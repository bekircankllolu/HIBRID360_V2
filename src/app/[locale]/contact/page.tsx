import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { BotBubble } from "@/components/brief/ChatParts";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMapLoader } from "@/components/contact/ContactMapLoader";
import { LocalTime } from "@/components/contact/LocalTime";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { Button } from "@/components/ui/Button";
import {
  CONTACT,
  CONTACT_IMAGES,
  CONTACT_LOCATION,
  directionsUrl,
  telUrl,
  whatsappUrl,
} from "@/data/contact";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates, SOCIAL_LINKS } from "@/lib/site";
import styles from "./page.module.css";

/**
 * CON-01..08 (nihai copy deck, Ağustos 2026) — Contact.
 *
 * LAB (monks.com Connect sayfası) — sayfa ritmi:
 *
 *   1. PageIntro, SARI tema zemini: "Sizden haber almak isteriz." dev dar
 *      başlık (orta kelimeler serif, son kelime el çizimi halkada), giriş
 *      cümlesi, "Merhaba deyin" e-posta butonu.
 *   2. Doğrudan ulaşın — e-posta / telefon / sosyal satırları (1px çizgi).
 *   3. Ofis — monks ofis listesi: İstanbul yerel saati (istemcide) + şehir,
 *      adres, yol tarifi.
 *   4. SİYAH: Motion Office anlatısı — İstanbul panoraması büyük kenar
 *      boşluklu çerçevede, üç ekip dev dolu numaralarla.
 *   5. SİYAH: tam genişlik harita (çerçeveli).
 *   6. Kağıt: "sohbet" formu — solda yapışkan başlık, sağda Hibrid 360
 *      avatarı + balonlar, alanlar sohbet dilinde (ContactForm theme="chat").
 *   7. Sayfa sonu çağrısı (CtaBand, sarı — layout'tan) + footer.
 *
 * Metinlerin hepsi deck'ten (contact.*); yalnız bölüm etiketleri ve form
 * yönlendirme cümlesi `lab.contact.*` altında (kısa, nötr UI metni).
 *
 * Harita: anahtar gerektirmeyen MapLibre GL JS + CARTO vektör karoları
 * (9 Eylül 2026'da Google Maps'in yerini aldı — bkz. karar #29,
 * docs/DECISIONS.md). `CONTACT_LOCATION` (lat/lng) kullanır — uydurulan
 * hiçbir veri yok. e2e sözleşmesi: `section[aria-labelledby="contact-map"]`
 * içinde canvas + CARTO atfı, sayfada google.com/maps/dir bağlantısı.
 *
 * CON-03 [KARAR]: "Yayına girecek e-posta adresi teyit edilmeli." Deck
 * kendi içinde contact@hibrid360.com veriyor (GEN-05'te de aynı adres) —
 * bu yüzden bu adres kullanıldı, ama TODO olarak bırakıldı: son onay
 * gelmeden bu sayfa/footer yayına alınmamalı.
 *
 * Adres: eski site (© 2020) farklı bir Kadıköy adresi gösteriyor; kodda
 * güncel deck adresi var ve çelişki src/data/contact.ts içinde yorumla,
 * CURRENT_CONTENT_GAPS.md'de madde olarak duruyor — **uydurularak
 * çözülmedi**.
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
    title: t("title.contact"),
    description:
      locale === "en"
        ? "Tell us what you are making and when. Istanbul, Kadıköy — or a 30-minute intro call, wherever you are."
        : "Ne üretmek istediğinizi ve zamanlamanızı anlatın. İstanbul, Kadıköy’de ya da 30 dakikalık çevrim içi görüşmede buluşalım.",
    alternates: localizedAlternates(locale, "/contact"),
  };
}

/**
 * Başlığı üç sese böler: baş (sans) · orta iki kelime (serif) · son kelime
 * (el çizimi halka). "Sizden | haber almak | isteriz." ·
 * "We would love to | hear from | you." Kısa metinde serif kısmı kalkar.
 */
function IntroTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const last = words.pop() ?? "";
  const serif = words.length > 2 ? words.splice(-2) : [];
  const head = words.join(" ");
  return (
    <>
      {head}
      {serif.length > 0 ? (
        <>
          {" "}
          <span className="lab-serif">{serif.join(" ")}</span>
        </>
      ) : null}{" "}
      <Scribble shape="circle" tone="ink" delay={250}>
        {last}
      </Scribble>
    </>
  );
}

/** Deck'teki "EKİP 1" büyük harf başlığı cümle düzenine (lab kuralı). */
function sentenceCase(text: string, locale: Locale): string {
  const lower = text.toLocaleLowerCase(locale);
  return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");
  const tCta = await getTranslations("cta");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tLab = await getTranslations("lab.contact");
  const tBrief = await getTranslations("lab.brief");
  const motionBody = t.raw("motionBody") as string[];
  const teams = t.raw("teams") as Array<{ title: string; body: string }>;
  const directionsHref = directionsUrl();
  const mailHref = `mailto:${CONTACT.email}`;

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      {/* 1 — tema renkli sayfa başı (monks Connect: sarı). */}
      <PageIntro
        ground="yellow"
        rail={<span lang="en">{tNav("contact")}</span>}
        title={<IntroTitle text={t("heroLead1")} />}
        lede={t("heroBody")}
        actions={<Button href={mailHref}>{t("heroLead2")}</Button>}
      />

      {/* 2 — doğrudan kanallar: satır listesi. */}
      <section className={styles.block} data-ground="paper" aria-labelledby="contact-channels">
        <h2 id="contact-channels" className={`lab-rail ${styles.rail}`}>
          {tLab("channelsRail")}
        </h2>
        <dl className={styles.rows}>
          <Reveal className={styles.row}>
            <dt className="lab-meta">{t("emailLabel")}</dt>
            <dd className={styles.value}>
              <a href={mailHref}>{CONTACT.email}</a>
            </dd>
            <dd className={styles.action}>
              <Button href={mailHref} size="sm" variant="ghost">
                {tCta("email")}
              </Button>
            </dd>
          </Reveal>
          <Reveal className={styles.row} delay={80}>
            <dt className="lab-meta">{t("phoneLabel")}</dt>
            <dd className={styles.value}>
              <a href={telUrl()}>{CONTACT.phone}</a>
            </dd>
            <dd className={styles.action}>
              <Button href={whatsappUrl()} size="sm" variant="ghost" target="_blank" rel="noreferrer">
                {tCta("whatsapp")}
              </Button>
            </dd>
          </Reveal>
          <Reveal className={styles.row} delay={160}>
            <dt className="lab-meta">{tFooter("social.label")}</dt>
            <dd className={`${styles.value} ${styles.social}`}>
              {SOCIAL_LINKS.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noreferrer">
                  {link.name}
                </a>
              ))}
            </dd>
            <dd className={`lab-meta ${styles.action}`}>{t("socialInvite")}</dd>
          </Reveal>
        </dl>
      </section>

      {/* 3 — ofis listesi (monks): yerel saat + şehir · adres · yol tarifi. */}
      <section
        className={`${styles.block} ${styles.officeBlock}`}
        data-ground="paper"
        aria-labelledby="contact-office"
      >
        <h2 id="contact-office" className={`lab-rail ${styles.rail}`}>
          {tLab("officeRail")}
        </h2>
        <div className={styles.office}>
          <p className={styles.city}>
            <span className={`lab-meta ${styles.clock}`}>
              <span className={styles.clockDot} aria-hidden="true" />
              <span className="srOnly">{tLab("localTime")}: </span>
              <LocalTime timeZone="Europe/Istanbul" locale={locale} />
            </span>
            <span className={styles.cityName}>{tLab("city")}</span>
          </p>
          <div className={styles.addressCell}>
            <p className="lab-meta">{t("addressLabel")}</p>
            <address className={styles.address}>
              {CONTACT.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>
          <div className={styles.officeAction}>
            <Button href={directionsHref} size="sm" target="_blank" rel="noreferrer">
              {t("directions")}
            </Button>
          </div>
        </div>
      </section>

      {/* 4 — Motion Office: siyah zemin, çerçeveli panorama + anlatı. */}
      <section className={styles.motion} data-ground="black" aria-labelledby="contact-motion">
        <div className={styles.motionHead}>
          <p className={`lab-rail ${styles.rail}`} lang="en">
            {tLab("motionRail")}
          </p>
          <h2 id="contact-motion" className={`lab-h2 ${styles.motionTitle}`}>
            {t("motionTitle")}
          </h2>
        </div>

        <figure className={styles.figure}>
          <picture>
            <source type="image/avif" srcSet={CONTACT_IMAGES.panorama.avif} sizes="100vw" />
            <source type="image/webp" srcSet={CONTACT_IMAGES.panorama.webp} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.figureImage}
              src={CONTACT_IMAGES.panorama.fallback}
              width={CONTACT_IMAGES.panorama.width}
              height={CONTACT_IMAGES.panorama.height}
              alt={t("photoCaption")}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption className={`lab-meta ${styles.figureCaption}`}>{t("photoCaption")}</figcaption>
        </figure>

        <div className={styles.motionGrid}>
          <div className={styles.motionBody}>
            {motionBody.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.motionAside}>
            <h3 className="lab-h3">{t("motionQuestion")}</h3>
            <p>{t("motionIntro")}</p>
          </div>
        </div>

        <div className={styles.teams}>
          {teams.map((team, index) => (
            <Reveal key={team.title} className={styles.team} delay={index * 90}>
              <span className={styles.teamNumber} aria-hidden="true">
                {index + 1}
              </span>
              <h3 className={`lab-h3 ${styles.teamTitle}`}>{sentenceCase(team.title, locale)}</h3>
              <p className={styles.teamBody}>{team.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 — harita: siyah zeminde çerçeveli. 9 Eylül 2026: CARTO/MapLibre
          vektör haritası (bkz. src/data/contact.ts karar notu), sayfayla
          birlikte doğrudan yüklenir. */}
      <section className={styles.mapSection} data-ground="black" aria-labelledby="contact-map">
        <h2 id="contact-map" className="srOnly">
          {t("mapTitle")}
        </h2>
        <div className={styles.mapFrame}>
          <ContactMapLoader center={CONTACT_LOCATION} />
        </div>
        <p className={`lab-meta ${styles.mapFallback}`}>
          <span>{t("mapNote")}</span>
          <a href={directionsHref} target="_blank" rel="noreferrer">
            {t("directions")} →
          </a>
        </p>
      </section>

      {/* 6 — sohbet formu (monks "Let's unlock what's possible together."). */}
      <section className={styles.formSection} data-ground="paper" aria-labelledby="contact-form-title">
        <div className={styles.formIntro}>
          <p className="lab-rail">{tLab("formRail")}</p>
          <h2 id="contact-form-title" className={`lab-h2 ${styles.formTitle}`}>
            {t("heroTitle")}
          </h2>
        </div>

        <div className={styles.chat}>
          <BotBubble tone="question" avatar={tBrief("avatar")}>
            <p className={styles.hello}>{tBrief("greeting")}</p>
            <p>{tLab("formPrompt")}</p>
          </BotBubble>

          <ContactForm locale={locale} theme="chat" />

          <div className={styles.booking}>
            <BotBubble tone="greeting">
              <p>{t("bookingLead")}</p>
            </BotBubble>
            <div className={styles.bookingAction}>
              <Button href={whatsappUrl()} size="sm" variant="ghost" target="_blank" rel="noreferrer">
                {tCta("whatsapp")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
