import styles from "./CulturePending.module.css";

/**
 * LAB — içerik henüz gelmemiş bölümün dürüst durumu, `data-ground`
 * temasına uyan sürüm. Ortak `EmptyState` siyah zemine göre çizildiği
 * (beyaz saydam çerçeve) için kağıt zeminde kayboluyordu; bu bileşen aynı
 * bilgiyi (etiket + mesaj) anlamsal değişkenlerle verir. Metinler çağırandan
 * gelir (`common.pendingLabel` + sayfanın kendi mesajı) — uydurma yok.
 */
export function CulturePending({
  label,
  message,
  detail,
}: {
  label: string;
  message: string;
  detail?: string;
}) {
  return (
    <div className={styles.pending} role="status">
      <span className={styles.label}>
        <span className={styles.dot} aria-hidden="true" />
        {label}
      </span>
      <p className={styles.message}>{message}</p>
      {detail ? <p className={styles.detail}>{detail}</p> : null}
    </div>
  );
}
