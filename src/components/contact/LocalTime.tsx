"use client";

import { useEffect, useState } from "react";

/**
 * LAB (monks ofis listesi) — ofisin yerel saati, "14:05" biçiminde.
 *
 * Yalnız istemcide: sunucu saati ile tarayıcı saati farklı dakikaya
 * düşerse hidrasyon uyuşmazlığı olurdu. İlk boyamada yer tutucu (—:—)
 * basılır; genişlik `tabular-nums` + sabit karakter sayısıyla aynı kalır
 * (CLS yok). Dakikada bir, dakika başına hizalanarak güncellenir.
 */

function format(timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function LocalTime({
  timeZone,
  locale,
  className,
}: {
  timeZone: string;
  locale: string;
  className?: string;
}) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(format(timeZone, locale));
      // Bir sonraki dakikanın başına hizala.
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, [timeZone, locale]);

  return (
    <time className={className} dateTime={time ?? undefined} aria-live="off">
      {time ?? "––:––"}
    </time>
  );
}
