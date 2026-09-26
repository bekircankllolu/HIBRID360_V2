"use client";

import { useEffect, useState } from "react";

/**
 * LAB (monks.com Connect ofis listesi) — bir şehrin yerel saati.
 *
 * Sunucu çıktısı saat taşımaz (hidrasyon uyuşmazlığı olmasın): ilk
 * boyamada "--:--", istemcide dakikada bir güncellenir.
 */
export function LocalTime({ timeZone, locale }: { timeZone: string; locale: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <time>--:--</time>;

  const formatted = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(now);

  return <time dateTime={now.toISOString()}>{formatted}</time>;
}
