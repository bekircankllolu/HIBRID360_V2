import styles from "./ShareLinks.module.css";

/**
 * Yazıyı paylaş — JS'siz, izleyicisiz düz bağlantılar (paylaşım
 * düğmesi betikleri yüklenmez; performans bütçesi + çerez rızası).
 */
export function ShareLinks({
  url,
  title,
  heading,
  emailLabel,
}: {
  url: string;
  title: string;
  heading: string;
  emailLabel: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}` },
    { label: emailLabel, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <nav className={styles.share} aria-label={heading}>
      <p className={styles.heading}>{heading}</p>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              className={styles.link}
              href={link.href}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
