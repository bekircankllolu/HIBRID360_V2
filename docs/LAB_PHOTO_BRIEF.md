# LAB — What We Do fotoğraf brief'i (Higgsfield ile üretilecek)

Kullanıcı (26 Eylül 2026): "What We Do altındaki görsellerin görsel dili çok uyumlu değil. Daha profesyonel, jenerik, güzel, net fotoğraflar; sitenin görsel diline uygun. Higgsfield ile üretip yerleştir."

## Görsel dil (yeni site: kağıt zemin, editoryal, monks)
- Gün ışığı / yumuşak doğal pencere ışığı; aydınlık, ferah, temiz modern mekânlar.
- Yetkin, güler yüzlü, doğal (poz vermeyen) profesyoneller; çeşitli ekip; odak net, arka plan hafif flu.
- Nötr palet (beyaz, gri, açık ahşap, siyah ekipman). Sarı/fuşya jel, neon, mor/pembe LED YOK.
- Editoryal belgesel fotoğraf hissi: 35–50 mm, göz hizası ya da hafif omuz üstü; kalabalık değil, bir ana özne.
- Yazı, logo, marka, ekranda okunur metin YOK. Gerçek kişi/ünlü benzerliği YOK.
- Kadraj: 4:5 dikey, 2K (kartlarda 24:25 ve 4:5 kırpılır — özne ortada, üstte nefes payı).
- Sitede varsayılan hafif doygunluk düşürme (saturate 0.82) + hover'da tam renk: renkler doğal kalsın, abartılı grade yok.

## Çekim listesi (mevcut onaylı liste güncellendi)
| Hizmet | Sahne |
|---|---|
| Creative | Aydınlık stüdyo masasında storyboard ve moodboard üzerinde çalışan iki kreatif; biri kalemle işaret ediyor, gülümsüyor |
| Production | Gün ışığında set: yönetmen ve kamera operatörü monitöre bakıp gülümsüyor, sinema kamerası ön planda flu |
| Post Production | Pencereden ışık alan kurgu odasında editör renk düzeltme konsolunda; iki ekran, ekranlarda soyut görüntü |
| Digital | Açık ofiste genç tasarım/geliştirme ekibi büyük ekran önünde tartışıyor; ekranda okunur metin yok |
| Live Broadcast | Kontrol odasında kulaklıklı yayın yönetmeni, önünde monitör duvarı; sakin, odaklı |
| Cloud TV | Küçük, aydınlık kurumsal stüdyoda sunucu kameraya konuşuyor, ön planda teleprompter/kamera flu |
| Event Management | Boş salonda sahne kurulumu: kulaklık ve tabletli prodüktör sahneye bakıyor, arkada ışık truss'ları gündüz ışığında |

## Prompt şablonu
"Editorial documentary photograph, 4:5 vertical. {SAHNE}. Soft natural daylight from large windows, clean modern space, neutral palette of white, warm grey, light wood and black equipment. Competent, relaxed professionals, candid moment, not posed. Sharp focus on the main subject, gentle background blur, 35mm lens at eye level. No text, no logos, no screens with readable text, no neon, no coloured gels, no purple or pink lighting."

## Yerleştirme
- Dosya adı: `public/images/site/services/<servis>-photo-v5.webp` (1600×2000, WebP q≈80).
- `src/data/site-images.ts` → `services.<key>.src` + alt metin (TR/EN, sahneyi betimler) + `focus`.
- Etkilenen yerler: What We Do hub kartları, ana sayfa hizmet kartları, 7 hizmet sayfasının film alanı (tam genişlik fotoğraf).
- Önce 7 kareyi kullanıcıya göster, onaydan sonra yerleştir (Faz 3 kuralı).
