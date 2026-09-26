"use client";

import { useTranslations } from "next-intl";
import { Scribble } from "@/components/lab/Scribble";
import { Button } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import styles from "./CtaBand.module.css";

/**
 * GEN-08/09 — iç sayfaların altındaki birincil + ikincil CTA. Ana sayfada
 * müşteri isteğiyle kaldırıldı; diğer rotalarda layout üzerinden ortak
 * olarak gösterilir.
 *
 * LAB (monks sayfa sonu çağrısı — "Let's unlock what's possible
 * together."): sarı zemin, solda rail, sağda GEN-08 cümlesi dev dar başlık;
 * son kelimesinin altına el çizimi çizgi. Başlığın kendisi /contact
 * bağlantısı (cümle eskiden butonun etiketiydi — aynı metin, aynı hedef),
 * altında köşeli eylemler: İletişime geç + WhatsApp.
 *
 * İkincil butonlar:
 *   - WhatsApp: CONTACT.phone'dan (gerçek, teyitli numara) türetilmiş
 *     wa.me linki — uydurma bir numara değil.
 *   - Takvim hesabı teslim edilmediği sürece Contact sayfasına giden
 *     eylem, randevu vaadinde bulunmayan dürüst bir iletişim etiketi taşır.
 */

/** Son kelimeyi ayırır: el çizimi yalnız ona çekilir. */
function splitLastWord(text: string): [string, string] {
  const trimmed = text.trim();
  const index = trimmed.lastIndexOf(" ");
  if (index < 0) return ["", trimmed];
  return [trimmed.slice(0, index + 1), trimmed.slice(index + 1)];
}

export function CtaBand() {
  const t = useTranslations("cta");
  const tLab = useTranslations("lab.cta");
  const pathname = usePathname();
  const whatsappHref = `https://wa.me/${CONTACT.phone.replace(/[^0-9]/g, "")}`;

  if (pathname === "/") return null;

  const [lead, last] = splitLastWord(t("primary"));

  // Faz 2 / B0: Creative'e özel kısa bant kalktı — bant her iç sayfada aynı
  // yükseklikte (Creative, kardeş hizmet sayfalarıyla aynı ritme döndü).
  return (
    <section className={styles.band} data-ground="yellow" aria-labelledby="cta-band-title">
      <p className={`lab-rail ${styles.rail}`}>{tLab("rail")}</p>
      <div className={styles.body}>
        <h2 id="cta-band-title" className={`lab-display ${styles.title}`}>
          <Link href="/contact" className={styles.titleLink}>
            {lead}
            <Scribble shape="underline" tone="current">
              {last}
            </Scribble>
          </Link>
        </h2>
        <div className={styles.actions}>
          <Button href="/contact">{t("contact")}</Button>
          <Button href={whatsappHref} variant="ghost" target="_blank" rel="noreferrer">
            {t("whatsapp")}
          </Button>
        </div>
      </div>
    </section>
  );
}
