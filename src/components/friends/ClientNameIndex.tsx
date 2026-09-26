"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ClientEntry } from "@/data/clients";
import styles from "./ClientNameIndex.module.css";

const ALL = "all";

const GROUPS = [
  { id: "a-f", label: "A-F", start: "A", end: "F" },
  { id: "g-l", label: "G-L", start: "G", end: "L" },
  { id: "m-r", label: "M-R", start: "M", end: "R" },
  { id: "s-z", label: "S-Z", start: "S", end: "Z" },
] as const;

function firstLatinLetter(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .charAt(0)
    .toUpperCase();
}

function inGroup(name: string, groupId: string) {
  const group = GROUPS.find((candidate) => candidate.id === groupId);
  if (!group) return true;
  const letter = firstLatinLetter(name);
  return letter >= group.start && letter <= group.end;
}

/**
 * Müşteri (Friends) marka dizini — LAB (monks.com "Work inventory" dili).
 *
 * Başlık + canlı sayaç ("84 marka") + alfabetik süzgeç hapları, altında
 * çerçevesiz tipografik isim ızgarası. Sektör verisi doğrulanmadığı için
 * süzgeç gerçek veriden türeyen alfabetik aralıklar; uydurma kategori yok.
 * JS yokken tüm isimler görünür (süzgeç yalnız daraltır).
 */
export function ClientNameIndex({ clients }: { clients: ClientEntry[] }) {
  const t = useTranslations("clients.index");
  const tLab = useTranslations("lab.culture.friends");
  const [activeGroup, setActiveGroup] = useState(ALL);

  const visibleClients = useMemo(
    () =>
      activeGroup === ALL
        ? clients
        : clients.filter((client) => inGroup(client.name, activeGroup)),
    [activeGroup, clients],
  );

  const filters = [{ id: ALL, label: t("all") }, ...GROUPS.map(({ id, label }) => ({ id, label }))];

  return (
    <section className={styles.index} aria-labelledby="client-index-title" data-ground="paper">
      <div className={styles.head}>
        <h2 id="client-index-title" className={`lab-h2 ${styles.title}`}>
          {t("label")}
        </h2>
        <p className={styles.count} aria-live="polite">
          {tLab("brands", { count: visibleClients.length })}
        </p>
      </div>

      <div className={styles.filters} role="group" aria-label={t("label")}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={styles.filter}
            aria-pressed={activeGroup === filter.id}
            onClick={() => setActiveGroup(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <ul className={styles.names}>
        {visibleClients.map((client) => (
          <li key={client.name} className={styles.nameItem}>
            <span>{client.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
