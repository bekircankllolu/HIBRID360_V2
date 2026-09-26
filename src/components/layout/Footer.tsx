import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BRAND_SIGNATURE_LINES, SOCIAL_LINKS, CONTACT } from "@/lib/site";
import { FOOTER_NAV } from "@/data/navigation";
import { isSustainabilityPublishable } from "@/data/sustainability";
import styles from "./Footer.module.css";

/**
 * Footer.
 *
 * Keşfet sütunu `src/data/navigation.ts` → `FOOTER_NAV` üzerinden geliyor
 * (üst menünün tamamı). Böylece müşteri revizyonundaki menü sırası
 * footer'a da tek kaynaktan yansır.
 *
 * Etiketler `messages/*.json` → `nav.*` ve `footer.*`.
 */
export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const legalItems: Array<{ href: string; label: string }> = [
    { href: "/privacy", label: t("legal.privacy") },
    { href: "/cookie-policy", label: t("legal.cookie") },
    { href: "/kvkk", label: t("legal.kvkk") },
    { href: "/terms", label: t("legal.terms") },
    { href: "/ai-policy", label: t("legal.aiUsage") },
    { href: "/accessibility", label: t("legal.accessibility") },
    { href: "/culture/sustainability", label: t("legal.sustainability") },
  ];

  const showCarbonBadge = isSustainabilityPublishable();

  return (
    <footer className={styles.footer} data-ground="black">
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <p className={styles.wordmark} lang="en">Hibrid 360</p>
          <p className={styles.statement}>
            {BRAND_SIGNATURE_LINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        {/* LAB (monks): solda etiket, ortada dev keşfet linkleri, sağda ok
            daireli yasal liste, en sağda iletişim + sosyal hap'ları. */}
        <div className={styles.explore}>
          <h2 className={styles.exploreLabel}>{tNav("explore")}…</h2>

          <nav className={styles.bigNav} aria-label={tNav("explore")}>
            <ul>
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.bigLink}>
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.legalNav} aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="srOnly">
              {tNav("legal")}
            </h2>
            <ul>
              {legalItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.legalLink}>
                    <span>{item.label}</span>
                    <span className={styles.legalDot} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.side}>
            <section aria-labelledby="footer-contact">
              <h2 id="footer-contact" className={styles.sideLabel}>
                {tNav("contact")}
              </h2>
              <address className={styles.contact}>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
                <span className={styles.address}>
                  {CONTACT.addressLines.map((line) => (
                    <span className={styles.addressLine} key={line}>
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            </section>

            <section aria-labelledby="footer-social">
              <h2 id="footer-social" className={styles.sideLabel}>
                {t("social.label")}
              </h2>
              <div className={styles.socialPills}>
                {SOCIAL_LINKS.map((platform) => (
                  <a key={platform.name} href={platform.href} target="_blank" rel="noreferrer">
                    {platform.name}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>{t("copyright")}</p>
          {showCarbonBadge && (
            <Link href="/culture/sustainability" className={styles.carbonBadge}>
              {t("carbonNeutral")}
            </Link>
          )}
          <a href="#top" className={styles.backToTop}>
            {t("backToTop")} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
