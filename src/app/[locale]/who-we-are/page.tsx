import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import { NumberedRows } from "@/components/culture/NumberedRows";
import { splitVoice, titleCase, unquote } from "@/components/culture/lab-text";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/site";
import { FOUNDER } from "@/data/who-we-are";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

/**
 * CUL-01..06 (nihai copy deck, Ağustos 2026) — Who We Are.
 *
 * 29 Ağustos 2026 revizyonu: sayfa /culture/who-we-are'dan üst menüdeki
 * canonical /who-we-are rotasına taşındı; eski yol kalıcı olarak buraya
 * yönlendiriliyor (next.config.mjs). İçerik değişmedi.
 *
 * CUL-03/04: kurucu (Zühre Didem Gödek, President & CCO) fotoğrafı ve
 * video repliği. Fotoğraf varlığı henüz teslim edilmedi; bölüm o yüzden
 * **tipografik** çalışıyor. Fotoğraf geldiğinde tek değişiklik
 * src/data/who-we-are.ts içindeki FOUNDER.portrait alanını doldurmak.
 * Replik altındaki "AI ile üretilmiş temsili görseldir" ibaresi zorunlu
 * (messages "video.aiGenerated" — tekil kaynak).
 *
 * CUL-06: kültür filmi — MeetTheCrewReveal (dairesel scroll sahnesi),
 * CULTURE_FILM veri kapısıyla. Sahne sayfanın TEK büyük hareket anı.
 *
 * LAB (monks.com "About" dili) — zemin ritmi:
 *   PageIntro (kağıt; quote1 konuşan başlık, sans + serif devam)
 *   → Hikâyemiz (kağıt; quote2 serif ifade + gövde cümleleri numaralı satır)
 *   → Ekip filmi (siyah)
 *   → Ne yapıyorsak oyuz! (sarı vurgu; son kelimede el çizimi halka)
 *   → Kurucu (kağıt; dev serif replik + isim)
 * Metinler aynı; yalnız tırnaklar başlığa taşınırken düştü ve kurucu adı
 * büyük harften ad düzenine indi (lab kuralı: büyük harf başlık yok).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title.whoWeAre"),
    description:
      locale === "en"
        ? "An Istanbul-based creative production studio building the visual experiences of the future — meet the crew."
        : "Geleceğin görsel deneyimlerini üreten İstanbul merkezli kreatif prodüksiyon stüdyosu; ekibimizle tanışın.",
    alternates: localizedAlternates(locale, "/who-we-are"),
  };
}

/** Başlığın son kelimesini ayırır (el çizimi halka o kelimeye). */
function splitLastWord(text: string): { rest: string; last: string } {
  const at = text.trim().lastIndexOf(" ");
  if (at < 0) return { rest: "", last: text.trim() };
  return { rest: text.slice(0, at + 1), last: text.slice(at + 1).trim() };
}

export default async function WhoWeArePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("culture.whoWeAre");
  const tLab = await getTranslations("lab.culture.who");
  const tVideo = await getTranslations("video");
  const body = t.raw("body") as string[];
  const secondBody = t.raw("secondBody") as string[];
  const portrait = FOUNDER.portrait;

  const headline = splitVoice(unquote(t("quote1")));
  const promise = splitLastWord(t("secondTitle"));

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Who We Are", path: "/who-we-are" },
        ])}
      />

      <PageIntro
        rail={t("heroTitle")}
        title={
          <>
            {headline.head} <span className="lab-serif">{headline.tail}</span>
          </>
        }
        lede={t("heroLead")}
      />

      <Section ground="paper" rail={tLab("story")}>
        <p className={`${shared.statement} ${styles.statement}`}>{unquote(t("quote2"))}</p>
        <NumberedRows rows={body.map((text) => ({ text }))} voice={false} />
      </Section>

      {/* LAB: "Ekiple tanışın" TV kafalı kültür filmi (MeetTheCrewReveal)
          kaldırıldı — kullanıcı kararı 26 Eylül 2026: yeni dile yabancı, gerçek
          ekibi değil AI temsili görseli gösteriyordu. Bileşen dosyası duruyor;
          gerçek ekip filmi/fotoğrafı gelince bu yuvaya yeni dilde bölüm girer. */}

      <Section ground="yellow" rail={tLab("promise")} labelledBy="who-promise-title">
        <h2 id="who-promise-title" className={`lab-display ${styles.promiseTitle}`}>
          {promise.rest}
          <span className={styles.promiseMark}>
            <Scribble shape="circle" tone="ink" delay={250}>
              {promise.last}
            </Scribble>
          </span>
        </h2>
        <div className={shared.prose}>
          {secondBody.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* CUL-03/04 — kurucu. Portre varsa solda, yoksa tipografik. */}
      <Section ground="paper" rail={tLab("founder")}>
        <figure className={`${styles.founder} ${portrait ? styles.founderWithPortrait : ""}`}>
          {portrait ? (
            // next/image kullanılmıyor: Cloudflare Images srcset'i kendi
            // üretiyor (bkz. CLAUDE.md medya notu).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.portrait}
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div>
            <blockquote className={shared.statement}>{t("founderQuote")}</blockquote>
            <figcaption className={styles.identity}>
              <span className={`lab-h3 ${styles.name}`}>{titleCase(FOUNDER.name, "tr")}</span>
              <span className={styles.role} lang="en">
                {titleCase(FOUNDER.title, "en")}
              </span>
              <span className={styles.disclaimer}>{tVideo("aiGenerated")}</span>
            </figcaption>
          </div>
        </figure>
      </Section>
    </div>
  );
}
