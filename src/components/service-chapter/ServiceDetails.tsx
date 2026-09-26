import type { ReactNode } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/lab/Reveal";
import { Section } from "@/components/lab/Section";
import { Button } from "@/components/ui/Button";
import styles from "./ServiceDetails.module.css";

/**
 * Sayfaya özel ayrıntı blokları. Sayfa yalnız veriyi verir; görünüm şablonda.
 *
 *   rows       monks desen 4 — numara | kalın başlık + serif devam; 1px çizgi
 *   statement  geniş kalın iddia + kısa metin
 *   pending    içerik hazırlanıyor durumu (EmptyState) + isteğe bağlı bağlantı
 */
export interface ServiceDetailRow {
  /** Satır başlığı (ör. "Social Content"); yoksa satır tek cümledir. */
  title?: string;
  titleLang?: string;
  body: ReactNode;
}

export type ServiceDetail =
  | { kind: "rows"; id: string; rail?: string; title: ReactNode; titleLang?: string; rows: readonly ServiceDetailRow[] }
  | { kind: "statement"; id: string; rail?: string; title: string; titleLang?: string; body?: ReactNode; bodyLang?: string }
  | { kind: "pending"; id: string; title: string; message: string; link?: { href: string; label: string } };

function Rows({ detail }: { detail: Extract<ServiceDetail, { kind: "rows" }> }) {
  const titleId = `detail-${detail.id}`;
  return (
    <Section rail={detail.rail} labelledBy={titleId}>
      <h2 id={titleId} className={`lab-h2 ${styles.title}`} lang={detail.titleLang}>
        {detail.title}
      </h2>
      <ol className={styles.rows}>
        {detail.rows.map((row, index) => (
          <Reveal as="li" key={`${detail.id}-${index}`} delay={Math.min(index, 4) * 60} className={styles.row}>
            <span className={`lab-meta ${styles.index}`} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className={styles.text}>
              {row.title ? (
                <>
                  <strong className={styles.rowTitle} lang={row.titleLang}>
                    {row.title}
                  </strong>{" "}
                </>
              ) : null}
              <span className={styles.rowBody}>{row.body}</span>
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function Statement({ detail }: { detail: Extract<ServiceDetail, { kind: "statement" }> }) {
  const titleId = `detail-${detail.id}`;
  return (
    <Section rail={detail.rail} labelledBy={titleId}>
      <Reveal>
        <h2 id={titleId} className={styles.statement} lang={detail.titleLang}>
          {detail.title}
        </h2>
        {detail.body ? (
          <p className={styles.statementBody} lang={detail.bodyLang}>
            {detail.body}
          </p>
        ) : null}
      </Reveal>
    </Section>
  );
}

function Pending({ detail }: { detail: Extract<ServiceDetail, { kind: "pending" }> }) {
  const titleId = `detail-${detail.id}`;
  return (
    <Section rail={detail.title} labelledBy={titleId} tight>
      <h2 id={titleId} className="srOnly">
        {detail.title}
      </h2>
      <div className={styles.pending}>
        <EmptyState message={detail.message} compact align="start" />
        {detail.link ? (
          <Button href={detail.link.href} variant="ghost" size="sm">
            {detail.link.label}
          </Button>
        ) : null}
      </div>
    </Section>
  );
}

export function ServiceDetails({ details }: { details: readonly ServiceDetail[] }) {
  return (
    <div className={styles.details} data-ground="paper">
      {details.map((detail) => {
        if (detail.kind === "rows") return <Rows key={detail.id} detail={detail} />;
        if (detail.kind === "statement") return <Statement key={detail.id} detail={detail} />;
        return <Pending key={detail.id} detail={detail} />;
      })}
    </div>
  );
}
