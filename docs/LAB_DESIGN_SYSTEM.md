# LAB tasarım sistemi — monks.com dili, Hibrid 360 içeriği

Yalnız `C:\Users\bekir\HIBRID360-lab` (yerel deneme). GitHub'a push yok, commit yok, deploy yok.
Dev sunucusu: http://localhost:3400 (zaten çalışıyor; başka sunucu açma, `next build` çalıştırma).

## 0. Değişmezler
- Ana sayfa hero'su (`src/components/hero/HeroTypography*` ve alt bileşenleri: liquid "HIBRID" WebGL yazısı + yukarıdan inen showreel animasyonu) DEĞİŞMEZ.
- Logo: literal "Hibrid 360" render'ları `--font-logo` (Montserrat 800, büyük harf). Marka yazımı her yerde "Hibrid 360".
- Özgünlük: monks.com'un **düzen, ritim, tipografi hiyerarşisi ve hareket dilini** uygula. Monks'un metinlerini, görsellerini, logolarını, SVG'lerini, kodunu KOPYALAMA. İçerik Hibrid'in kendi verisi ve metinleri.
- İçerik uydurma yok: müşteri, proje, rakam, alıntı uydurma. Yeni UI metni gerekiyorsa `lab.<alan>` altında kısa, nötr (ör. "Tüm yazılar", "Öne çıkanlar").
- Konturlu (outline) yazı YOK. Büyük harf başlık YOK (cümle düzeni). Kısaltmalar (AI, TV, SEO) korunur.
- Renk: yalnız tokenlar (hex yasak — `hex-guard` testi var). Sarı ve pembe zeminde metin SİYAH.
- `prefers-reduced-motion`: hareket yok, içerik tam görünür. Klavye erişimi + görünür odak. Tek h1.
- Performans: `next/image` + `sizes` + lazy; video `poster` + `preload="none"`, görünür olunca oynat; aynı anda tek WebGL.

## 1. Zemin (tema) — `data-ground`
Herhangi bir elemana `data-ground="paper|black|yellow|pink|white"` ver → zemin + metin + buton renkleri otomatik.
Header kendi altındaki bölümün zeminini alır (otomatik). Footer siyah.

| Anlamsal değişken | Kullanım |
|---|---|
| `--ground` | zemin |
| `--ink` | ana metin, başlık |
| `--ink-soft` | ikincil metin, meta (AA ✓) |
| `--line` | ince ayırıcı çizgi (1px) |
| `--accent` | el çizimi / vurgu (kağıtta fuşya, siyahta sarı) |
| `--surface` | kart/iç panel zemini |
| `--btn-bg` / `--btn-fg` | birincil buton |

Sayfa tabanı `paper` (sıcak kırık beyaz, monks'un zemini). Önerilen ritim: çoğu içerik `paper`; sinematik/film/tam ekran görsel bölümleri `black`; sayfa başına en fazla bir-iki vurgu bölümü `yellow` ya da `pink` (monks her sayfada bir tema rengi kullanıyor: ör. What We Do pembe, Contact sarı).
Yeni CSS'te `--color-brand-*` yerine bu anlamsal değişkenleri kullan; böylece bölüm hangi zemine konursa konsun doğru görünür.

## 2. Tipografi
Fontlar tokenlarda: `--font-display` (geniş grotesk 800 — Helvetica Now Extended karşılığı), `--font-ui`/`--font-body` (Inter Tight), `--font-editorial` (Newsreader serif), `--font-hand` (Caveat).
Global sınıflar (`src/styles/lab-monks.css`):
- `.lab-display` — sayfa başı "konuşan" dev başlık: dar yüz 500, ~74px@1440. Bir kısmı `<span className="lab-serif">` ile serif olabilir (monks: "Transforming brands" serif + "for the real-time world" sans).
- `.lab-h2` — bölüm başlığı: geniş kalın 800, ~50px@1440.
- `.lab-h3` — kart/satır başlığı: dar 500, ~22px.
- `.lab-rail` — sol sütun etiketi: 15px 500.
- `.lab-body` / `.lab-meta` — gövde / meta.
Bir kompozisyonda en fazla 3 punto. Gövde 16–18px, satır 1.5.

## 3. Yapı taşları (`@/components/lab/*`)
- `PageIntro` — sayfa başı: `rail`, `title` (ReactNode), `lede`, `actions`, `ground`. Sayfanın h1'i.
- `Section` — `rail` + içerik ızgarası (sol etiket ~%25, içerik ~%75), `wide` (tam genişlik), `tight`, `ground`.
- `Scribble` — `<Scribble shape="circle|underline" tone="fuchsia|yellow|ink|current">kelime</Scribble>` el çizimi vurgu; başlıkta bir kelimeyi işaretle (sayfa başına 1–2, abartma). `ScribbleArrow` — etiketin yanında el çizimi ok. Renk için `tone="current"` + CSS `color: var(--accent)` tercih edilebilir.
- `LitText` — `<LitText as="h2" className="lab-h2" text="..." />` kaydırdıkça kelime kelime koyulaşan başlık (uzun manifesto/iddia cümleleri için).
- `Reveal` — `<Reveal delay={i*80}>` ekrana girince yükselerek belirme (kart ızgaraları, liste satırları).
- `Button` (`@/components/ui/Button`) — köşeli etiket kutusu + ayrı kare ok kutusu. `variant="primary"` zemine göre renklenir; `ghost` ince çerçeve; `size="sm"`.
- `useGroundShift` — bölüm ekrana oturunca kendi zeminine geçiş (data-grounded) — isteğe bağlı.
- `HibridZero` — ana sayfanın "Hibrid 36●" sahnesi (yalnız ana sayfa).
- Mevcut: `useScrollScene` (`--progress` 0→1; `sticky`/`pass`), `usePrefersReducedMotion`.

## 4. Desen kataloğu (monks'tan)
Ekran görüntüleri: `C:\Users\bekir\AppData\Local\Temp\claude\c--Users-bekir-HIBRID360\c9e69e08-45dd-435b-bb06-86f4c49a274e\scratchpad\monks\` (`p2\`, `p3\`, `p4\`, `mt\` altında; Read ile aç).
1. **Sayfa başı** — sol etiket + dev dar başlık (+ serif satır, + el çizimi vurgu), altında sayaç/filtre ya da giriş. (`mt\work-inventory.png`, `p2\work-inventory-1440-000-fold.png`)
2. **Kademeli kart ızgarası** — 4 sütun, 2. ve 4. sütun aşağıda, kartların arkasında yarım görünen dev DOLU numaralar. (`p2\home-1440-001-y1076.png`)
3. **Asimetrik öne çıkan üçlü** — geniş + küçük kare + orta kare, altta etiket + başlık + ok dairesi. (`home-1440-s03.png`)
4. **Satır listesi** — kategori | başlık (kalın sans + serif devam) | meta | buton; 1px çizgiler. (`p2\home-1440-011-y5576.png`)
5. **Tablo envanteri** — Müşteri | Proje | Hizmetler +N. (`p2\work-inventory-1440-001-y850.png`)
6. **Tam genişlik video bloğu** — büyük kenar boşluklu, üstünde "İzle 00:58" hapı. (`p2\home-1440-004-y2426.png`)
7. **Kelime kelime yanan iddia** — geniş kalın h2, kaydırmayla koyulaşır. (`p2\home-1440-003-y1976.png`)
8. **Yatay kart şeridi** — hafif eğik beyaz kartlar, içinde eğik görsel, sağ altta + dairesi. (`p2\what-we-do-1440-006-y5100.png`)
9. **Karanlık video üstünde hizmet listesi** — sağda büyük link listesi + kısa açıklama. (`mt\what-we-do.png` 3. kare)
10. **Tema renkli sayfa** — sayfanın hero'su pembe/sarı/şeftali zeminde, el çizimi vurgu. (`mt\what-we-do.png`, `mt\connect.png`)
11. **Ofis listesi / yerel saat**, **partner logo ızgarası**, **"Bize yazın" sohbet formu** (`mt\connect.png`, `p4\chat-1.png`).
12. **Sayfa sonu çağrı** — "Birlikte neyi mümkün kılabiliriz?" gibi dev başlık + köşeli buton, çoğunlukla sarı zemin.

## 5. Sayfa tarifi
`PageIntro` (paper ya da sayfanın tema rengi) → 3–6 `Section` (desen kataloğundan, zemin ritmi: paper ↔ black ↔ tek vurgu) → sayfa sonu çağrı (yellow) → Footer (siyah, otomatik).
Sayfa başına en fazla bir büyük hareket anı (sticky sahne, LitText ya da ground shift) — gerisi `Reveal`.

## 6. Doğrulama
- `npx tsc --noEmit` temiz (başkasının dosyasındaki hata senin sorunun değil; kendi dosyaların temiz olsun).
- `npx vitest run <kendi klasörlerin>` + `npx vitest run src/styles` (hex bekçisi). Bekçi senin dosyanda hex sayısının DÜŞMESİNİ hata sayıyorsa `src/styles/hex-baseline.json`'daki YALNIZ kendi dosya satırlarını düşür.
- Ekran görüntüsü: `cd "C:/Users/bekir/AppData/Local/Temp/claude/c--Users-bekir-HIBRID360/c9e69e08-45dd-435b-bb06-86f4c49a274e/scratchpad/monks" && MSYS_NO_PATHCONV=1 node shoot.mjs <etiket> 1440 /tr/<rota>,/tr/<rota2>` (tam sayfa, `...\scratchpad\lab\<etiket>\`), dar ekran için `390`. Belirli kaydırma konumu: `MSYS_NO_PATHCONV=1 node scene.mjs <etiket> 1440 /tr/<rota> "<css seçici>" 0,0.5` (`reduced` son argüman = hareket azaltma). Tam sayfa görüntüde `Reveal`/`Scribble` tetiklenmemiş görünebilir — `scene.mjs` ile doğrula.
- Konsol/pageerror hatası yok. 390px'te yatay taşma yok.
- Çeviri: yalnız `lab.<alan>` altına, TR+EN birlikte, tek `node -e` komutuyla oku→birleştir→yaz (2 boşluk girinti, sonda `\n`). Edit/Write ile `tr.json`/`en.json` düzenleme (başka ajanlar da yazıyor).
