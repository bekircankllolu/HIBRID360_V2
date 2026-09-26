import type { BriefQuestion } from "@/data/brief-builder";
import type { Locale } from "@/i18n/routing";

/** Brief Builder'ın yerel durumu — gönderim yükü `submitBrief`'te kurulur. */
export interface Answers {
  what_making: string | null;
  who_for: string;
  when_live: string | null;
  where_running: string[];
  budget_band: string | null;
  reference_link: string;
  contact_email: string;
}

export const EMPTY_ANSWERS: Answers = {
  what_making: null,
  who_for: "",
  when_live: null,
  where_running: [],
  budget_band: null,
  reference_link: "",
  contact_email: "",
};

/**
 * Bir sorunun cevabı, kullanıcının gördüğü dilde (seçenek DEĞERİ değil
 * ETİKETİ: "reklam_filmi" değil "Reklam filmi"). Cevap yoksa boş string —
 * çağıran "—" gibi bir yer tutucu basar.
 *
 * `contact` adımı iki alan toplar; sohbet balonunda ikisi tek satırda.
 */
export function answerText(question: BriefQuestion, answers: Answers, locale: Locale): string {
  const labelOf = (value: string) =>
    question.options?.find((option) => option.value === value)?.label[locale] ?? value;

  switch (question.type) {
    case "single": {
      const value = answers[question.field];
      return typeof value === "string" ? labelOf(value) : "";
    }
    case "multi":
      return answers.where_running.map(labelOf).join(", ");
    case "text":
      return answers.who_for.trim();
    case "contact":
      return [answers.reference_link.trim(), answers.contact_email.trim()]
        .filter(Boolean)
        .join(" · ");
  }
}
