/**
 * Site görselleri kaydı.
 *
 * `focus`: `object-fit: cover` ile kırpılan yüzeylerde `object-position`
 * değeri. Varsayılan merkez kırpma çoğu görselde doğru; yalnızca kaynak
 * oranı hedef kutudan belirgin biçimde uzaksa odak noktası belirtilir.
 * Ölçüm ve gerekçe ilgili girdinin yorumunda.
 */
export const siteImages = {
  home: {
    makeBrand: {
      src: "/images/site/home/make-brand.webp",
      alt: "Production camera in a dark studio setup",
    },
    closing: {
      src: "/images/site/home/closing-bicycle.webp",
      alt: "Black and white bicycle handlebar detail",
    },
    closingBody: {
      src: "/images/site/home/moon-scroll-poster.webp",
      videoSrc: "/videos/home-moon-scroll.mp4",
      alt: "Two cyclists crossing a luminous yellow moon",
    },
  },
  work: {
    story: {
      src: "/images/site/work/story-clapper.webp",
      alt: "A clapperboard marked Your Story on a vivid production set",
    },
  },
  culture: {
    // LAB v2 (26 Eylül 2026): şefkat yerine iş birliği — set ekibinin
    // elleri kamerayı birlikte kuruyor. Seedream 5.0 Pro, AI ile üretildi
    // (docs/HIGGSFIELD_PROMPTS_CULTURE.md).
    standFor: {
      src: "/images/site/culture/what-we-stand-for-v2.webp",
      alt: {
        tr: "Karanlık bir sette birkaç ekip üyesinin elleri sinema kamerasını birlikte tripoda yerleştiriyor",
        en: "On a dark film set, several crew members' hands work together to mount a cinema camera on a tripod",
      },
    },
  },
  thinkAndThank: {
    strategy: {
      src: "/images/site/think-and-thank/strategy.webp",
      alt: {
        tr: "Siyah katmanlar, saydam yüzeyler ve sarı ibreden oluşan editoryal pusula",
        en: "Editorial compass made of black layers, clear surfaces and a yellow pointer",
      },
    },
    production: {
      src: "/images/site/think-and-thank/production.webp",
      alt: {
        tr: "Kamera, film şeridi ve sarı ışıkla kurulan editoryal prodüksiyon kompozisyonu",
        en: "Editorial production composition with a camera, film strip and yellow light",
      },
    },
    ai: {
      src: "/images/site/think-and-thank/ai.webp",
      alt: {
        tr: "Saydam katmanlar ve hareket çizgilerinden oluşan yapay zekâ başı",
        en: "Artificial intelligence head formed from clear layers and motion lines",
      },
    },
    culture: {
      src: "/images/site/think-and-thank/culture.webp",
      alt: {
        tr: "Kulak, ses çatalı ve sarı plakla kurulan kinetik kültür kompozisyonu",
        en: "Kinetic culture composition with an ear, tuning fork and yellow record",
      },
    },
    // Müşteriden hazır grafik olarak gelen marka manifestosu görselleri
    // (8 Eylül 2026 e-posta eki) — metin görselin içine gömülü, ayrıca
    // sayfa kopyası olarak tekrarlanmaz.
    statementStory: {
      src: "/images/site/think-and-thank/statement-your-story.webp",
      alt: {
        tr: "Pembe zemin üzerinde kırmızı, krem ve mavi renklerle “IT’S YOUR STORY. MAKE IT MATTER. HYPE THE VIBE. AMPLIFY THE IMPACT.” yazan kalp biçimli mücevher illüstrasyonu",
        en: "Heart-shaped faceted gem illustration on a pink background reading “IT’S YOUR STORY. MAKE IT MATTER. HYPE THE VIBE. AMPLIFY THE IMPACT.” in red, cream and blue",
      },
    },
    statementPure: {
      src: "/images/site/think-and-thank/statement-pure-simple-powerful.webp",
      alt: {
        tr: "Sarı zemin üzerinde siyah büyük harflerle 'PURE. SIMPLE. POWERFUL.' yazısı",
        en: "Bold black type reading 'PURE. SIMPLE. POWERFUL.' on a yellow background",
      },
    },
    statementImpact: {
      src: "/images/site/think-and-thank/statement-idea-to-impact.webp",
      alt: {
        tr: "Siyah zemin üzerinde beyaz ve fuşya harflerle “FROM IDEA TO IMPACT WE MAKE BRANDS MOVE” yazısı, IMPACT kelimesi fuşya renkte",
        en: "White and fuchsia type reading “FROM IDEA TO IMPACT WE MAKE BRANDS MOVE” on a black background, with IMPACT highlighted in fuchsia",
      },
    },
  },
  /**
   * What We Do hizmet görselleri — v4 seti (19 Eylül 2026).
   *
   * Sekizi de TEK bir prompt ailesinden üretildi: siyah baskın kadraj, tek
   * pratik sarı ışık kaynağı, tek küçük fuşya gösterge, 50mm f/2 sığ alan
   * derinliği. Sanat yönetimi ve kabul ölçütleri
   * `docs/design/WHAT_WE_DO_VISUAL_LANGUAGE.md`; türevler
   * `scripts/generate-service-photos-v4.mjs` (2400x1600 webp, q82).
   *
   * v3'teki marka sarısı DUOTONE kalktı: birliği artık sahnenin kendisi
   * kuruyor, görsele sürülen bir filtre değil. Yüzler gerçek bir kişiye
   * benzemiyor ve hiçbirinde yazı/logo/filigran yok.
   */
  services: {
    // LAB: AI showreel karesi (22.7 sn), 24:25 kırpım — AI ile üretilmiş.
    aiCreativeProduction: {
      src: "/images/site/services/ai-creative-production-still.webp",
      alt: {
        tr: "AI ile üretilmiş portre: siyah zeminde altın yaka takısı takan bir kadın kameraya bakıyor",
        en: "AI-generated portrait: a woman wearing a gold collar looks into the camera against a black background",
      },
      focus: "50% 30%",
    },
    // LAB v5 (26 Eylül 2026) — sinematik set, Seedream 5.0 Pro
    // (docs/HIGGSFIELD_PROMPTS.md). `src` 4:5 kart karesi (1200×1500),
    // `wideSrc` 16:9 film alanı (2400×1350). Gece/tungsten ışık, sis, mor-pembe
    // ışık ve okunur yazı yok. AI ile üretildi; yüzler gerçek kişi değil.
    creative: {
      src: "/images/site/services/creative-photo-v5.webp",
      wideSrc: "/images/site/services/creative-wide-v5.webp",
      alt: {
        tr: "Akşam bir yaratıcı stüdyoda sarkıt lambanın altında storyboard karelerinin üzerine eğilmiş iki sanat yönetmeni, biri kalemle bir kareyi çiziyor",
        en: "Two art directors lean over storyboard frames under a pendant lamp in a creative studio at dusk, one sketching on a frame with a pencil",
      },
      focus: "50% 40%",
    },
    production: {
      src: "/images/site/services/production-photo-v5.webp",
      wideSrc: "/images/site/services/production-wide-v5.webp",
      alt: {
        tr: "Yağmurdan sonra gece setinde sinema kamerasının başında birlikte vizöre bakan yönetmen ve kamera operatörü, arkada sisli sokak ışıkları",
        en: "A director and a camera operator look through a cinema camera together on a rain-wet night set, misty street lights behind them",
      },
      focus: "50% 40%",
    },
    postProduction: {
      src: "/images/site/services/post-production-photo-v5.webp",
      wideSrc: "/images/site/services/post-production-wide-v5.webp",
      alt: {
        tr: "Karanlık bir kurgu ve renk odasında büyük monitördeki dağ manzarası üzerinde çalışan kolorist, eller kontrol panelinde",
        en: "A colourist works on a mountain landscape shown on a large monitor in a dark edit and grading suite, hands on the control panel",
      },
      focus: "50% 40%",
    },
    digital: {
      src: "/images/site/services/digital-photo-v5.webp",
      wideSrc: "/images/site/services/digital-wide-v5.webp",
      alt: {
        tr: "Gece şehir ışıkları önünde büyük ekrandaki soyut tasarım üzerine konuşan küçük dijital ekip, biri ekranı işaret ediyor",
        en: "A small digital team discusses an abstract design on a large screen at night in front of city lights, one person pointing at the screen",
      },
      focus: "50% 40%",
    },
    liveBroadcast: {
      src: "/images/site/services/live-broadcast-photo-v5.webp",
      wideSrc: "/images/site/services/live-broadcast-wide-v5.webp",
      alt: {
        tr: "Canlı yayın rejisinde kulaklıklı yayın yönetmeni monitör duvarına doğru eğilmiş, eli görüntü mikserinin üzerinde",
        en: "A broadcast director in a headset leans toward a wall of monitors in a live gallery, hand on the vision mixer",
      },
      focus: "50% 40%",
    },
    cloudTv: {
      src: "/images/site/services/cloud-tv-photo-v5.webp",
      wideSrc: "/images/site/services/cloud-tv-wide-v5.webp",
      alt: {
        tr: "Küçük bir stüdyoda yumuşak ışıkla aydınlatılmış sunucu, ön planda odak dışı kamera ve prompter",
        en: "A presenter lit by soft light in a small studio, camera and teleprompter out of focus in the foreground",
      },
      focus: "50% 40%",
    },
    eventManagement: {
      src: "/images/site/services/event-management-photo-v5.webp",
      wideSrc: "/images/site/services/event-management-wide-v5.webp",
      alt: {
        tr: "Prova sırasında boş bir arenada sahnenin kenarında kulaklık ve tabletle duran prodüktör, arkada sisi yaran ışık huzmesi",
        en: "A producer with a headset and tablet stands at the edge of the stage in an empty arena during rehearsal, a beam of light cutting through haze behind",
      },
      focus: "50% 40%",
    },
    photography: {
      src: "/images/site/services/photography-photo-v4.webp",
      alt: {
        tr: "Karanlık bir sette softbox ayarlayan fotoğrafçı, modelling ışığı zemine yayılıyor",
        en: "A photographer adjusting a softbox on a dark set, the modelling light spilling across the floor",
      },
      focus: "50% 50%",
    },
  },
} as const;
