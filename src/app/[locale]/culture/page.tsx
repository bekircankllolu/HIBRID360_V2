import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ChapterCards } from "@/components/culture/ChapterCards";
import { ValueCards } from "@/components/culture/ValueCards";
import { sentenceCase } from "@/components/culture/lab-text";
import { LitText } from "@/components/lab/LitText";
import { PageIntro } from "@/components/lab/PageIntro";
import { Scribble } from "@/components/lab/Scribble";
import { Section } from "@/components/lab/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteImages } from "@/data/site-images";
import { breadcrumbListJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import shared from "@/styles/culture-page.module.css";
import styles from "./page.module.css";

// brief-rev12.md Bölüm 3.1 / nihai copy deck Bölüm 6 — CULTURE altı.
//
// 29 Ağustos 2026 revizyonu: Who We Are · What We Believe · Partners üst
// menüye kendi canonical rotalarıyla çıktı (eski /culture/* yolları oraya
// kalıcı olarak yönlendiriliyor). CULTURE'ın kendisi de üst menüden çıktı
// ama rota **silinmedi**: Directors & Crew ve Sustainability'nin başka bir
// üst sayfası yok, ikisi de buradan ve footer'dan erişiliyor.
//
// LAB (monks.com "Careers / Culture" dili):
//   PageIntro (pembe tema) → kademeli bölüm kartları (kağıt) → "What we
//   stand for" siyah film bandı + kelime kelime yanan iddia (sayfanın tek
//   büyük hareket anı) → değer kartları (kağıt, monks "Our Values").
// Kartlara açıklama YAZILMADI — deck bu hub için tanım cümlesi vermedi ve
// uydurma metin commit edilmiyor. Değer başlıkları büyük harften cümle
// düzenine indi (metin aynı, yalnız yazım biçimi — lab kuralı).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Our Culture",
    description:
      locale === "en"
        ? "The ideas, people and values that define us."
        : "Bizi tanımlayan fikirler, insanlar ve değerler.",
  };
}

// Önizleme görselleri scripts ile değil elle üretildi: sitedeki/arşivdeki
// ilgili fotoğrafın siyah->marka sarısı duotone'u, 640x800 (4:5).
const SECTIONS = [
  { href: "/who-we-are", key: "whoWeAre", image: "/images/site/culture/hub-who-we-are-v2.webp" },
  { href: "/what-we-believe", key: "whatWeBelieve", image: "/images/site/culture/hub-what-we-believe-v2.webp" },
  { href: "/think-and-thank", key: "thinkAndThank", image: "/images/site/culture/hub-think-and-thank-v2.webp" },
  { href: "/culture/directors", key: "directors", image: "/images/site/culture/hub-directors.webp" },
  { href: "/culture/sustainability", key: "sustainability", image: "/images/site/culture/hub-sustainability.webp" },
] as const;

const STAND_FOR_COPY = {
  tr: {
    lead: [
      "Şundan eminiz: En iyi işleri mutlu insanlar üretir.",
      "Bu yüzden herkesin gelişebildiği, desteklendiğini hissettiği ve her gün en iyi hâlini ortaya koyabildiği bir kültür kurduk.",
    ],
    values: [
      {
        title: "BİRLİKTE DAHA İYİYİZ",
        body: "Harika hiçbir şey tek başına üretilmez. Egoları, politik çekişmeleri ve olumsuzluğu kapının dışında bırakıp uzmanlıklarımızı ve iş birliği enerjimizi yaptığımız her işe taşıdığımızda, birlikte her zaman daha iyi işler üretiriz.",
      },
      {
        title: "VAZGEÇMEDEN MERAK ET",
        body: "Merak kediyi öldürmedi. Ama mevcut düzenle yetinmek öldürür. Sorular sormayı, var olan çözümleri didik didik etmeyi ve yarının en öncü işlerini bugünden üretme yolunda beklenenle asla yetinmemeyi sürdüreceğiz.",
      },
      {
        title: "İŞİ BİTİR",
        body: "Bardak altlıkları kupalar içindir. Biz ancak ürettiğimiz iş ve müşterilerimize teslim ettiğimiz sonuçlar kadar iyiyiz. Yarını beklemeyiz. Sorumluluk alır, çok çalışır ve işleri bugün ileri taşırız.",
      },
    ],
  },
  en: {
    lead: [
      "We know one thing for sure: happy people create the best work.",
      "That’s why we’ve built a culture where everyone can thrive, feel supported, and bring their A-game every day.",
    ],
    values: [
      {
        title: "BETTER TOGETHER",
        body: "Nothing great is made alone. By leaving egos, politics and negativity at the door and bringing our specialisms and collaborative energy to everything we do, we’ll always make better work together.",
      },
      {
        title: "RELENTLESSLY CURIOUS",
        body: "Curiosity didn’t kill the cat. But sticking to the status quo will. We’ll always ask questions, kick the tyres of existing solutions, and never settle for the expected in the pursuit of tomorrow’s most pioneering work, today.",
      },
      {
        title: "GET SH*T DONE",
        body: "Coasters are for mugs. We are only as good as the work we do and the results we deliver for our clients. We don’t wait for tomorrow. We take ownership, work hard and drive things forward, today.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    lead: readonly [string, string];
    values: readonly { title: string; body: string }[];
  }
>;

export default async function CulturePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "culture.hub" });
  const tLab = await getTranslations({ locale, namespace: "lab.culture.hub" });
  const standFor = STAND_FOR_COPY[locale];

  return (
    <div className={shared.page}>
      <JsonLd
        data={breadcrumbListJsonLd(locale, [
          { name: "Home", path: "" },
          { name: "Culture", path: "/culture" },
        ])}
      />

      <PageIntro
        ground="pink"
        rail={tLab("rail")}
        title={tLab.rich("title", {
          mark: (chunks) => (
            <Scribble shape="circle" tone="ink" delay={300}>
              {chunks}
            </Scribble>
          ),
          serif: (chunks) => <span className="lab-serif">{chunks}</span>,
        })}
      />

      <Section wide ground="paper" rail={tLab("chapters")}>
        <ChapterCards
          eyebrow={tLab("rail")}
          items={SECTIONS.map((section) => ({
            href: section.href,
            title: t(section.key),
            image: section.image,
            // "Think & Thank" iki dilde de marka adı.
            lang: section.key === "thinkAndThank" && locale === "tr" ? "en" : undefined,
          }))}
        />
      </Section>

      <Section ground="black" rail={tLab("stance")} labelledBy="stand-for-title">
        <h2 id="stand-for-title" className={`lab-h2 ${styles.standForTitle}`} lang="en">
          What we stand for
        </h2>
        <LitText as="p" className={`lab-display ${styles.standForClaim}`} text={standFor.lead[0]} />
        <p className={styles.standForBody}>{standFor.lead[1]}</p>
      </Section>

      <div data-ground="black" className={styles.standForFrame}>
        <figure className={styles.standForImage}>
          <Image
            src={siteImages.culture.standFor.src}
            alt={siteImages.culture.standFor.alt[locale]}
            fill
            sizes="(max-width: 760px) 100vw, 92vw"
          />
        </figure>
      </div>

      <Section ground="paper" rail={tLab("values")}>
        <ValueCards
          items={standFor.values.map((value) => ({
            title: sentenceCase(value.title, locale),
            body: value.body,
          }))}
        />
      </Section>
    </div>
  );
}
