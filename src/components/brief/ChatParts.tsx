import { forwardRef, type ReactNode } from "react";
import styles from "./Chat.module.css";

/**
 * LAB (monks.com "Let's unlock what's possible together.") — Brief
 * Builder'ın sohbet dili: saf sunum parçaları, durum yok.
 *
 *   Avatar      siyah daire içinde "Hibrid 360" logotipi (MONA DEĞİL —
 *               kullanıcı kararı). Dekoratif: ekran okuyucu atlar.
 *   BotBubble   Hibrid 360'ın söylediği (sol). Tonlar: soru sarı, selamlama
 *               fuşya-açık, geçmiş soru soluk yüzey, hata fuşya — sarı ve
 *               fuşya zeminde metin SİYAH (CLAUDE.md kontrast kuralı).
 *   UserBubble  kullanıcının cevabı (sağa yaslı, zeminin tersi renk).
 *
 * Stiller `Chat.module.css`'te ve `data-ground`'a duyarlı: Brief (kağıt)
 * ve Contact formu (kağıt) aynı parçaları kullanır.
 *   Progress    nokta ilerleme + görünür "Soru n / 6" metni.
 */

export type BotTone = "question" | "greeting" | "past" | "error";

export function Avatar({ label }: { label: string }) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {/* `logo` sınıf adı bilinçli: lab katmanının büyük harf istisnası
          [class*="logo"] ile eşleşir (bkz. src/styles/lab-monks.css). */}
      {/* lang="en": TR sayfada büyük harf dönüşümü "İ" üretmesin. */}
      <span className={styles.logo} lang="en">
        {label}
      </span>
    </span>
  );
}

interface BotBubbleProps {
  tone: BotTone;
  children: ReactNode;
  /** Avatar yalnız aktif (en son) Hibrid 360 satırında durur. */
  avatar?: string;
  className?: string;
}

export function BotBubble({ tone, children, avatar, className = "" }: BotBubbleProps) {
  return (
    <div className={`${styles.botRow} ${avatar ? styles.withAvatar : ""} ${className}`}>
      {avatar && <Avatar label={avatar} />}
      <div className={`${styles.bubble} ${styles.bot} ${styles[tone]}`}>{children}</div>
    </div>
  );
}

/** Soru metni balonun içinde başlık; adım değişince odak buraya taşınır. */
export const BubbleHeading = forwardRef<HTMLHeadingElement, { children: ReactNode }>(
  function BubbleHeading({ children }, ref) {
    return (
      <h2 ref={ref} tabIndex={-1} className={styles.questionText}>
        {children}
      </h2>
    );
  },
);

interface UserBubbleProps {
  children: ReactNode;
  /** Ekran okuyucu için "Yanıtınız:" öneki. */
  srPrefix: string;
  muted?: boolean;
}

export function UserBubble({ children, srPrefix, muted = false }: UserBubbleProps) {
  return (
    <p className={`${styles.bubble} ${styles.user} ${muted ? styles.userMuted : ""}`}>
      <span className="srOnly">{srPrefix}: </span>
      {children}
    </p>
  );
}

interface ProgressProps {
  /** 0 tabanlı aktif adım; `total` özet ekranı demek (hepsi dolu). */
  current: number;
  total: number;
  /** Görünür metin; yoksa yalnız noktalar (dekoratif). */
  label?: string;
}

export function Progress({ current, total, label }: ProgressProps) {
  return (
    <p className={styles.progress}>
      <span className={styles.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={styles.dot}
            data-state={index < current ? "done" : index === current ? "current" : "todo"}
          />
        ))}
      </span>
      {label && <span className={styles.progressLabel}>{label}</span>}
    </p>
  );
}
