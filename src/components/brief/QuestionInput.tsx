"use client";

import { useTranslations } from "next-intl";
import type { BriefQuestion } from "@/data/brief-builder";
import type { Locale } from "@/i18n/routing";
import type { Answers } from "./brief-answers";
import styles from "./BriefBuilder.module.css";

/**
 * Aktif sorunun cevap alanı — sohbetin kullanıcı (sağ) tarafı.
 *
 *   single / multi  hap seçenekler; seçili hap beyaz zemin + siyah metin
 *                   (kullanıcı balonuyla aynı renk: "bu sizin cevabınız")
 *   text / contact  monks'un beyaz, yuvarlak köşeli tek giriş kutusu;
 *                   etiket kutunun içinde GÖRÜNÜR kalır (placeholder değil)
 *
 * Mantık BriefBuilder'dakiyle birebir: aynı alanlar, aynı güncelleme.
 */

interface QuestionInputProps {
  question: BriefQuestion;
  answers: Answers;
  locale: Locale;
  onChange: (patch: Partial<Answers>) => void;
  onToggleMulti: (value: string) => void;
}

export function QuestionInput({ question, answers, locale, onChange, onToggleMulti }: QuestionInputProps) {
  const t = useTranslations("brief");

  if (question.type === "single" || question.type === "multi") {
    const isPressed = (value: string) =>
      question.type === "multi"
        ? answers.where_running.includes(value)
        : answers[question.field] === value;

    return (
      <div className={styles.reply}>
        <div className={styles.options}>
          {question.options?.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              aria-pressed={isPressed(option.value)}
              onClick={() =>
                question.type === "multi"
                  ? onToggleMulti(option.value)
                  : onChange({ [question.field]: option.value })
              }
            >
              {option.label[locale]}
            </button>
          ))}
        </div>
        {question.field === "budget_band" && (
          // TODO: docs/DECISIONS.md #15 bekleniyor — bütçe bantları
          // How We Work sayfasındakiyle aynı olacak (brief 18.8).
          <p className={styles.pendingNote}>{t("budgetPending")}</p>
        )}
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <div className={styles.reply}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{t("fields.whoFor")}</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={answers.who_for}
            onChange={(event) => onChange({ who_for: event.target.value })}
          />
        </label>
      </div>
    );
  }

  return (
    <div className={styles.reply}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{t("fields.reference")}</span>
        <input
          type="url"
          inputMode="url"
          autoComplete="url"
          className={styles.input}
          value={answers.reference_link}
          onChange={(event) => onChange({ reference_link: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          {t("fields.email")}
          <span aria-hidden="true">*</span>
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          className={styles.input}
          value={answers.contact_email}
          onChange={(event) => onChange({ contact_email: event.target.value })}
        />
      </label>
      {/* TODO: brief 18.8 — referans DOSYASI yüklemesi
          (reference_file_url) Cloudflare R2 bucket'ı açılınca
          eklenecek; şimdilik yalnızca link alanı var. */}
    </div>
  );
}
