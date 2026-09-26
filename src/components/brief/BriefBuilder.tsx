"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { briefQuestions, briefIntro, briefOutro } from "@/data/brief-builder";
import { submitBrief, type SubmissionResult } from "@/lib/submissions";
import { Button } from "@/components/ui/Button";
import { EMPTY_ANSWERS, answerText, type Answers } from "./brief-answers";
import { BotBubble, BubbleHeading, Progress, UserBubble } from "./ChatParts";
import { QuestionInput } from "./QuestionInput";
import styles from "./BriefBuilder.module.css";

/**
 * Brief Builder — brief-rev12.md Bölüm 18.8.
 * Altı soru, ekran ekran sorulur. Açılış ve kapanış metinleri
 * SİTEYE GİRECEK METİN kutularından birebir.
 *
 * LAB (monks.com): sunum sohbet dili — Hibrid 360 avatarı + soru balonu,
 * cevaplanan sorular üstte küçük balon çiftleri olarak birikir, altta tek
 * aktif cevap alanı, nokta ilerleme ve ok daireli "İleri". Adım/gönderim
 * mantığı değişmedi.
 *
 * Odak: adım değişince odak yeni sorunun başlığına taşınır (ekran okuyucu
 * soruyu okur, görünür alana kayar); ilk yüklemede odak çalınmaz. Aktif
 * adım bir <form>: metin alanında Enter "İleri" demek. `noValidate`:
 * e-posta boşken de özete geçilebilir, doğrulama eskisi gibi sunucuda
 * (src/lib/submissions.ts).
 *
 * Gizlilik (brief 18.8 uygulama notu): KVKK açık rıza kutucuğu olmadan
 * form gönderilemez — hem burada hem sunucu tarafında doğrulanır. Verinin
 * yalnızca teklif süreci için kullanıldığı tek cümleyle sayfada yazar.
 */

const TOTAL = briefQuestions.length;

export function BriefBuilder({ locale }: { locale: Locale }) {
  const t = useTranslations("brief");
  const tLab = useTranslations("lab.brief");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);

  const isSummary = step >= TOTAL;
  const question = isSummary ? null : briefQuestions[step];
  const avatar = tLab("avatar");

  const sent = result?.ok === true;

  useEffect(() => {
    if (navigated.current || sent) headingRef.current?.focus();
  }, [step, sent]);

  const goTo = (next: number) => {
    navigated.current = true;
    setStep(next);
  };

  const patch = (next: Partial<Answers>) => setAnswers((prev) => ({ ...prev, ...next }));

  const toggleMulti = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      where_running: prev.where_running.includes(value)
        ? prev.where_running.filter((v) => v !== value)
        : [...prev.where_running, value],
    }));
  };

  const onNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goTo(step + 1);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    const response = await submitBrief({
      what_making: answers.what_making,
      who_for: answers.who_for || null,
      when_live: answers.when_live,
      where_running: answers.where_running,
      budget_band: answers.budget_band,
      reference_link: answers.reference_link || null,
      contact_email: answers.contact_email,
      kvkk_consent: consent,
      language: locale,
    });
    setResult(response);
    setSubmitting(false);
  };

  // `contact` adımının özet satırı yalnız referans link; e-posta ayrı satır.
  const summaryCard = (
    <dl className={styles.summary}>
      {briefQuestions.map((q) => {
        const display = q.type === "contact" ? answers.reference_link.trim() : answerText(q, answers, locale);
        return (
          <div key={q.field} className={styles.summaryRow}>
            <dt>{q.label[locale]}</dt>
            <dd>{display || t("notAnswered")}</dd>
          </div>
        );
      })}
      <div className={styles.summaryRow}>
        <dt>{t("fields.email")}</dt>
        <dd>{answers.contact_email || t("notAnswered")}</dd>
      </div>
    </dl>
  );

  if (sent) {
    return (
      <div className={styles.chat}>
        <div className={styles.active}>
          <BotBubble tone="question" avatar={avatar} className={styles.enter}>
            <BubbleHeading ref={headingRef}>{t("sent")}</BubbleHeading>
          </BotBubble>
          <BotBubble tone="greeting" className={styles.enterLate}>
            <p>{briefOutro[locale]}</p>
          </BotBubble>
          <div className={`${styles.userSide} ${styles.enterLate}`}>{summaryCard}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <ol className={styles.log} aria-label={tLab("chatLabel")}>
        {/* Açılış — brief 18.8 metni, birebir; "Merhaba 👋" lab taslağı. */}
        <li className={styles.turn}>
          <BotBubble tone="greeting">
            <p className={styles.greetingHello}>{tLab("greeting")}</p>
            <p>{briefIntro[locale]}</p>
          </BotBubble>
        </li>
        {/* Özette geçmiş balonlar tekrar edilmez: özet kartı aynı dökümü verir. */}
        {!isSummary && briefQuestions.slice(0, step).map((q) => {
          const text = answerText(q, answers, locale);
          return (
            <li key={q.field} className={styles.turn}>
              <BotBubble tone="past">
                <p>{q.label[locale]}</p>
              </BotBubble>
              <div className={styles.userSide}>
                <UserBubble srPrefix={tLab("yourAnswer")} muted={!text}>
                  {text || t("notAnswered")}
                </UserBubble>
              </div>
            </li>
          );
        })}
      </ol>

      {question && (
        <form key={step} className={styles.active} onSubmit={onNext} noValidate>
          <BotBubble tone="question" avatar={avatar} className={styles.enter}>
            <BubbleHeading ref={headingRef}>{question.label[locale]}</BubbleHeading>
          </BotBubble>

          <div className={styles.enterLate}>
            <QuestionInput
              question={question}
              answers={answers}
              locale={locale}
              onChange={patch}
              onToggleMulti={toggleMulti}
            />
          </div>

          <div className={styles.nav}>
            <Progress
              current={step}
              total={TOTAL}
              label={t("progress", { current: step + 1, total: TOTAL })}
            />
            <div className={styles.navActions}>
              {step > 0 && (
                <button type="button" className={styles.back} onClick={() => goTo(step - 1)}>
                  {t("back")}
                </button>
              )}
              <Button type="submit">{t("next")}</Button>
            </div>
          </div>
        </form>
      )}

      {isSummary && (
        <div key="summary" className={styles.active}>
          <BotBubble tone="question" avatar={avatar} className={styles.enter}>
            <BubbleHeading ref={headingRef}>{t("summaryTitle")}</BubbleHeading>
          </BotBubble>

          <div className={`${styles.userSide} ${styles.enterLate}`}>{summaryCard}</div>

          {/* brief 18.8: "Toplanan veri yalnızca teklif süreci için
              kullanılır ve bu sayfada tek cümleyle yazılır." Yapay zekâ
              kullanılıyorsa o da tek cümleyle belirtilir. */}
          <BotBubble tone="past">
            <p>{t("privacyNote")}</p>
            <p>{t("aiNote")}</p>
          </BotBubble>

          <div className={styles.userSide}>
            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>{t("consent")}</span>
            </label>
          </div>

          {result && !result.ok && (
            <div role="alert">
              <BotBubble tone="error">
                <p>{t(`errors.${result.reason}`)}</p>
              </BotBubble>
            </div>
          )}

          <div className={styles.nav}>
            <Progress current={TOTAL} total={TOTAL} />
            <div className={styles.navActions}>
              <button type="button" className={styles.back} onClick={() => goTo(step - 1)}>
                {t("back")}
              </button>
              <Button disabled={!consent || submitting} onClick={onSubmit}>
                {submitting ? t("sending") : t("send")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
