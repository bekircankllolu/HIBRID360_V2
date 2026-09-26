# LAB — monks.com uyarlaması (yalnız yerel, GitHub'a ASLA push yok)

Klasör: `C:\Users\bekir\HIBRID360-lab` · dal `lab/monks` (canlı `af12551`'den) · remote YOK, pre-push kancası reddeder, deploy betikleri kilitli.
Çalıştır: `npm run lab` → http://localhost:3400

## Kurallar
- Ana sayfadaki liquid "HIBRID" yazısı ve yukarıdan inen showreel alanı DEĞİŞMEZ (`HeroTypography` ve alt bileşenleri).
- Logo ("Hibrid 360", Montserrat, büyük harf) değişmez. Marka yazımı "Hibrid 360".
- Konturlu/sonradan dolan yazı yok. Yalnız marka renkleri (+ `--color-brand-fuchsia-light`). Fuşya/sarı zeminde siyah metin.
- `prefers-reduced-motion`: her hareket kapanır, içerik tam görünür.
- Yeni metin gerekiyorsa `lab.*` altında, "lab taslağı".

## Temel katman (bitti)
- [x] Fontlar: Archivo wdth125 ("Lab Display"), Inter Tight, Caveat — `scripts/lab-fonts.py`, `src/styles/lab-monks.css`
- [x] Cümle düzeni: `text-transform` katmanı + 40 büyük harfli metin cümle düzenine (MONA, AI SHOWREEL, THINK & THANK hariç)
- [x] Ayrık buton (hap + ok dairesi) — `components/ui/Button.*`
- [x] Header kaydırma yönüne göre çekilir — `components/layout/Header.*`
- [x] El çizimi vurgu — `components/lab/Scribble.*`
- [x] "Hibrid 36●" sahnesi — `components/lab/HibridZero.*`, ana sayfada SolarSystem ile ReachOut arası
- [x] ReachOut: sol etiket sütunu, halkalı "Sizin", hap+daire CTA

## Sayfalar
- [x] Works: başlık + sayaç/filtre + öne çıkan 3 iş + Müşteri | Proje | Hizmetler tablosu (veri Supabase bekliyor, canlıda da boş)
- [x] Insights: 3 öne çıkan kart + satır düzeni (kategori | grotesk+serif başlık | dk okuma | Oku hapı); kategoriler cümle düzeni
- [x] What We Do hub: kademeli kartlar + arkada dev numaralar (01–08), sol etiket + halkalı "sekiz"
- [x] Brief Builder: sohbet görünümü (avatar, sarı soru balonu, sağa yaslı cevaplar, nokta ilerleme; mantık değişmedi)
- [x] Bölüm zemin geçişi — `components/lab/useGroundShift.ts`, ReachOut siyah→sarı
- [x] Footer: dev linkler + ok daireli yasal liste + sosyal haplar
- [x] ClosingBand CTA ortak ayrık Button'a geçti
- [ ] Karşılaştırma raporu (önce/sonra, mobil LCP)

## Doğrulama (25 Eylül)
- tsc temiz, vitest 50 dosya / 550 test geçti, 12 ana rota 200
- Bilinen: e2e canonical-routes + work-teamwork-field eski Works hero başlığını arıyor (lab için güncellenmedi)

## TUR 2 — tüm site en baştan (26 Eylül)
Kullanıcı: "tüm sayfaları, tüm fontları, her şeyi en baştan düzenle; yalnız hero HIBRID + showreel kalsın; butonlar köşeli olabilir".
- [x] Tema sistemi `data-ground` (paper/black/yellow/pink/white) + anlamsal tokenlar — `src/styles/lab-monks.css`
- [x] Site tabanı kağıt; header altındaki zemini alır; footer siyah
- [x] Köşeli ayrık buton (etiket kutusu + kare ok kutusu), zemine duyarlı
- [x] Yapı taşları: PageIntro, Section, LitText, Reveal (+ Scribble, HibridZero)
- [x] Tasarım sistemi rehberi — `docs/LAB_DESIGN_SYSTEM.md`
- [x] Ana sayfa (hero hariç): Sözümüz → Hizmetler (kademeli) → Sizin için… (kağıt→sarı) → İddia (LitText) → ay filmi → Make your brand → Ekosistem → Hibrid 36● → Aklımızdakiler → Az laf → sarı kapanış
- [x] Hizmet şablonu + 7 hizmet sayfası (ajan)
- [x] WWD hub + AI + Service Production + How We Work (ajan)
- [x] Culture ailesi + Friends (ajan)
- [x] Works + Think & Thank + detay sayfaları (ajan)
- [x] Contact, Brief, Solutions, yasal, 404, ortak sayfa bileşenleri (ajan)
- [x] Hizmet sayfalarında film alanı = tam genişlik sinematik fotoğraf (kalem çizimi cılızdı), gövde iki sütun
- [x] Dil ikonu header zeminine göre renk alır

## Doğrulama (26 Eylül)
- tsc temiz; vitest 56 dosya / 582 test geçti
- 36 rota × (390, 1440) = 72 kontrol: 200, sayfa hatası yok, tek h1, yatay taşma yok, büyük harf başlık yok
- e2e ÇALIŞTIRILMADI — eski yapıyı bekleyen testler kırılacak (service-chapter-*, think-and-thank, canonical-routes, work-teamwork-field); canlıya taşıma sırasında güncellenecek

## TUR 3 — eski dünyadan kalanlar (26 Eylül, kullanıcı kararları)
- [x] E.T. ay filmi ana sayfadan kaldırıldı (hukuki risk)
- [x] Who We Are "Ekiple tanışın" TV kafalı film kaldırıldı (bileşen duruyor; test güncellendi)
- [x] "Az laf, çok iş" sitenin fontlarıyla yeniden: serif "az laf," + geniş kalın "çok iş" + sarı halka, numaralı satırlar
- [x] Taç videosu (Friends) KALDI — müşteri istiyor
- [x] Think & Thank: pembe plak illüstrasyonu + kırmızı kolajlı film → tek "İzle" bölümü, kapak siyah-beyaz (hover renk), köşeli İzle düğmesi
- [x] Atatürk + Küçük Prens KALDI → editoryal görsel+metin bölünmesi (siyah/kağıt, dönüşümlü, kaydırmada yakınlaşma)
- [x] Ekosistem KALDI → başlık yeni dilde (rail + ince "One Hybrid Production" + geniş kalın sarı "Ecosystem")
- [x] "Make your brand the brand" → fotoğrafsız sade siyah bölüm (ekosisteme giriş) — deneme, beğenilmezse geri
- [x] İmleç KALDI (müşteri seviyor)
- [x] Hub AI kartı: AI showreel karesi (22.7 sn) fotoğraf olarak; hover'da MONA karartılmış fotoğrafın üstünde
- [x] Contact harita/Motion Office ve kristal logo KALDI
- Doğrulama: tsc + eslint temiz, vitest 582/582, 72 rota kontrolü temiz
