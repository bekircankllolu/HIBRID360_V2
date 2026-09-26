import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LitText } from "@/components/lab/LitText";
import { PageIntro } from "@/components/lab/PageIntro";
import { Reveal } from "@/components/lab/Reveal";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { Button } from "@/components/ui/Button";
import { serviceSignatureEndFrame } from "@/data/service-signature-videos";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { chapterOf, formatDegree, nextChapter } from "@/lib/service-chapter";
import { splitLastWord } from "./offering-case";
import { ServiceCapabilities } from "./ServiceCapabilities";
import { ServiceDetails, type ServiceDetail } from "./ServiceDetails";
import { ServiceNext } from "./ServiceNext";
import { ServiceReel, type ServiceReelProps } from "./ServiceReel";
import styles from "./ServiceChapter.module.css";

export type { ServiceDetail } from "./ServiceDetails";

/** Sayfa başının tema zemini (monks her hizmet sayfasını bir renkle açar). */
export type ServiceGround = "pink" | "yellow" | "paper";

export interface ServiceReelBlock extends ServiceReelProps {
  /** Film bloğunun sol etiketi (ör. "Kamera · lens · odak"). */
  caption: string;
  /** Filmin altındaki dürüstlük notu (ör. AI ile üretildi). */
  note?: string;
  /**
   * 4 sn'lik kalem çizimi imza filmi mi? Öyleyse film bölümünde hizmetin
   * sinematik fotoğrafı tam genişlikte durur, çizim iddianın yanına geçer
   * (çizim büyük siyah çerçevede cılız kalıyordu).
   */
  signature?: boolean;
}

export interface ServiceChapterProps {
  locale: Locale;
  chapterId: string;
  ground: ServiceGround;
  /** Marka sloganı — iki dilde de İngilizce; başlığın serif ikinci sesi. */
  slogan: string;
  /** Sayfa başının giriş cümlesi. */
  lede: string;
  /** Kelime kelime yanan iddia (tek paragraf). */
  manifesto: string;
  manifestoRail?: string;
  /** Okunur gövde paragrafları — hiçbiri sayfadan düşmez. */
  body: readonly string[];
  /** SERVICE_OFFERINGS satırları (büyük harf veri; ekranda başlık düzeni). */
  services: readonly string[];
  reel: ServiceReelBlock;
  /** `src` 4:5 kart karesi; `wideSrc` 16:9 film alanı (varsa oradan). */
  photo: { src: string; alt: string; focus?: string; wideSrc?: string };
  details?: readonly ServiceDetail[];
}

/** Bundan uzun iddia (ör. Live Broadcast, 40 kelime) bir kademe küçük basılır. */
const LONG_MANIFESTO_WORDS = 28;

/** 4 sn'lik kalem çizimi imza filmi → film bloğu (son kare poster). */
export function signatureReel(src: string, caption: string): ServiceReelBlock {
  return {
    sources: [{ src, type: "video/mp4" }],
    poster: serviceSignatureEndFrame(src),
    width: 1920,
    height: 1080,
    loop: false,
    caption,
    signature: true,
  };
}

/**
 * LAB — hizmet sayfası şablonu (monks.com "solution/capability" sayfası dili).
 *
 * Bölüm sırası:
 *   1. PageIntro (tema zemini) — "What We Do · 045°", hizmet adı + serif
 *      slogan (son kelimede el çizimi halka), giriş, brief / tüm hizmetler
 *   2. Film (siyah) — kenar boşluklu geniş kare + "İzle 00:04" hapı
 *   3. İddia (kağıt) — LitText (sayfanın TEK büyük hareket anı) + gövde
 *      paragrafları ve sinematik hizmet fotoğrafı
 *   4. Yetenekler (kağıt) — kademeli kart ızgarası, dev numaralar
 *   5. Ayrıntılar (kağıt) — sayfaya özel satır listeleri / iddialar
 *   6. Sıradaki hizmet (siyah) — dev bağlantı satırı + derece sayacı
 * Ardından layout'un ortak CtaBand'i (sarı, sayfa sonu çağrısı) ve siyah footer.
 *
 * Eski Service Chapter parçaları (ChapterHero, ScrollLitText, ChapterIndex,
 * ChapterNext, MonaShard/MonaDrift, imza filminin sticky kaydırma sahnesi)
 * bu şablonda kullanılmıyor; AI Creative Production gibi başka sayfalar
 * onları doğrudan import ettiği için dosyalar yerinde duruyor.
 */
export async function ServiceChapter({
  locale,
  chapterId,
  ground,
  slogan,
  lede,
  manifesto,
  manifestoRail,
  body,
  services,
  reel,
  photo,
  details = [],
}: ServiceChapterProps) {
  const t = await getTranslations("lab.services");
  const tChapter = await getTranslations("services.chapter");
  const tWhatWeDo = await getTranslations("whatWeDo");
  const chapter = chapterOf(chapterId);
  const next = nextChapter(chapterId);
  const list = tWhatWeDo.raw("list") as Array<{ title: string; body: string }>;
  const nextBlurb = list.find((item) => item.title === next.name)?.body ?? "";
  const { head, word, tail } = splitLastWord(slogan);
  const { caption, note, signature, ...reelProps } = reel;
  const manifestoWords = manifesto.split(/\s+/).filter(Boolean).length;
  const ids = {
    reel: `${chapter.id}-reel`,
    manifesto: `${chapter.id}-manifesto`,
    capabilities: `${chapter.id}-capabilities`,
  };

  return (
    <article className={styles.chapter} data-chapter={chapter.id} lang={locale}>
      <PageIntro
        ground={ground}
        rail={
          <span className={styles.rail}>
            <Link href="/what-we-do" className={styles.railLink} lang="en">
              What We Do
            </Link>
            <span className={styles.railDegree} aria-hidden="true">
              {formatDegree(chapter.degree)}
            </span>
          </span>
        }
        title={
          <>
            <span className={styles.titleName} lang="en">
              {chapter.name}
            </span>{" "}
            <span className={`lab-serif ${styles.titleSlogan}`} lang="en">
              {head}
              <Scribble shape="circle" tone="current" delay={350}>
                {word}
              </Scribble>
              {tail}
            </span>
          </>
        }
        lede={lede}
        actions={
          <>
            <Button href="/brief" variant="primary">
              {t("brief")}
            </Button>
            <Button href="/what-we-do" variant="ghost">
              {t("allServices")}
            </Button>
          </>
        }
      />

      <Section ground="black" rail={caption} labelledBy={ids.reel} className={styles.reelSection}>
        <h2 id={ids.reel} className="srOnly">
          {caption}
        </h2>
        {signature ? (
          <div className={styles.still}>
            <Image
              src={photo.wideSrc ?? photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 760px) 100vw, 75vw"
              style={{ objectPosition: photo.focus ?? "50% 50%" }}
            />
          </div>
        ) : (
          <ServiceReel {...reelProps} />
        )}
        {note ? <p className={`lab-meta ${styles.reelNote}`}>{note}</p> : null}
      </Section>

      <Section rail={manifestoRail ?? t("manifestoRail")} labelledBy={ids.manifesto}>
        <LitText
          id={ids.manifesto}
          as="h2"
          className={`lab-h2 ${styles.manifesto} ${manifestoWords > LONG_MANIFESTO_WORDS ? styles.manifestoLong : ""}`}
          text={manifesto}
        />
        <div
          className={styles.story}
          data-has-body={body.length > 0 ? "" : undefined}
          data-text-only={signature ? "" : undefined}
        >
          {body.length > 0 ? (
            <div className={styles.storyText}>
              {body.map((paragraph) => (
                <p key={paragraph} className="lab-body">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          {signature ? null : (
            <Reveal className={styles.photo}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={2400}
                height={1600}
                sizes="(max-width: 760px) 100vw, 44vw"
                style={{ objectPosition: photo.focus ?? "50% 50%" }}
              />
            </Reveal>
          )}
        </div>
      </Section>

      <Section wide rail={tChapter("servicesTitle")} labelledBy={ids.capabilities}>
        <h2 id={ids.capabilities} className={`lab-h2 ${styles.capabilitiesTitle}`}>
          {t("capabilitiesTitle")}
        </h2>
        <ServiceCapabilities items={services} serviceName={chapter.name} />
      </Section>

      {details.length > 0 ? <ServiceDetails details={details} /> : null}

      <ServiceNext currentId={chapter.id} label={t("next")} blurb={nextBlurb} />
    </article>
  );
}
