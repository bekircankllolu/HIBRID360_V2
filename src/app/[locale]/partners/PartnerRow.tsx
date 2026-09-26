import { Reveal } from "@/components/lab/Reveal";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

/**
 * Ortak hücresi — LAB (monks.com partner logo ızgarası).
 *
 * Logo varlığı teslim edilmediği için adın kendisi "yazı logosu" gibi
 * hücrenin ortasında dizilir (geniş display yüz). Altta onaylı açıklama ve
 * dış bağlantı; açıklama gelmediyse uydurulmaz, durum yazılır.
 * (Dosya adı eski satır sunumundan kaldı; içerik artık ızgara hücresi.)
 */
export function PartnerRow({
  index,
  order,
  name,
  body,
  url,
  pendingLabel,
  visitLabel,
}: {
  index: string;
  order: number;
  name: string;
  body: string | null;
  url: string | null;
  pendingLabel: string;
  visitLabel: string;
}) {
  return (
    <Reveal as="li" delay={order * 100} className={styles.cell}>
      <span className={styles.index} aria-hidden="true">
        {index}
      </span>
      <h2 className={styles.name}>{name}</h2>
      <div className={styles.detail}>
        {body ? (
          <p className={styles.body}>{body}</p>
        ) : (
          <p className={styles.pending}>
            <span className={styles.pendingDot} aria-hidden="true" />
            {pendingLabel}
          </p>
        )}
        {url ? (
          <Button href={`https://${url}`} variant="ghost" size="sm" target="_blank" rel="noreferrer">
            {visitLabel}
            <span className="srOnly"> — {url}</span>
          </Button>
        ) : null}
      </div>
    </Reveal>
  );
}
