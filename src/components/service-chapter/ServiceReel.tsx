"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { orderedSources, playbackState, type PlaybackIntent } from "./chapter-video";
import styles from "./ServiceReel.module.css";

export interface ServiceReelSource {
  src: string;
  type: string;
  media?: string;
}

export interface ServiceReelProps {
  sources: readonly ServiceReelSource[];
  poster: string;
  width: number;
  height: number;
  /**
   * `true`: döngülü film (Creative, Sequin Tide). `false`: bir kez çizilip
   * son karede duran imza filmi (4 sn, kalem çizimi).
   */
  loop: boolean;
  /** Filmin erişilebilir adı; verilmezse film dekoratif sayılır. */
  label?: string;
}

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * LAB (monks.com tam genişlik video bloğu, desen 6) — kenar boşluklu geniş
 * film karesi, altında "İzle 00:04" hapı.
 *
 * - `preload="none"` + poster; film görünür alana girince (%40) sessiz oynar,
 *   çıkınca durur. İmza filmi bir kez çizilir ve son karede kalır; poster o
 *   son kare olduğu için JS'siz ve hareket azaltmada da çizim tam görünür.
 * - Hareket azaltmada otomatik oynatma yok; hap ile kullanıcı oynatabilir.
 * - Hap her zaman görünür (WCAG 2.2.2 duraklatma denetimi).
 */
export function ServiceReel({ sources, poster, width, height, loop, label }: ServiceReelProps) {
  const t = useTranslations("video");
  const tLab = useTranslations("lab.services");
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const intentRef = useRef<PlaybackIntent>("auto");
  const playedOnceRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const videoId = useId();

  const play = useCallback((fromStart: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (fromStart || video.ended) video.currentTime = 0;
    const result = video.play();
    // Oynatma reddedilirse (güç tasarrufu) poster kalır; hap yeniden dener.
    if (result && typeof result.catch === "function") result.catch(() => undefined);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry && entry.intersectionRatio >= 0.4)),
      { threshold: [0, 0.4] },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const state = playbackState({ reduced, visible, intent: intentRef.current });
    if (state === "pause") {
      video.pause();
      return;
    }
    // İmza filmi yalnız ilk görünüşte kendiliğinden çizilir; sonrası hapla.
    if (!loop && playedOnceRef.current && intentRef.current === "auto") return;
    playedOnceRef.current = true;
    play(false);
  }, [reduced, visible, loop, play]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      intentRef.current = "pause";
      video.pause();
      return;
    }
    intentRef.current = "play";
    playedOnceRef.current = true;
    play(!loop && video.ended);
  };

  const action = playing ? t("pause") : t("play");

  return (
    <div className={styles.reel}>
      <div className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
        <video
          ref={videoRef}
          id={videoId}
          className={styles.video}
          poster={poster}
          width={width}
          height={height}
          muted
          loop={loop}
          playsInline
          preload="none"
          disablePictureInPicture
          aria-label={label}
          aria-hidden={label ? undefined : true}
          tabIndex={-1}
          data-playback={playing ? "playing" : "paused"}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            // Kullanıcı hapla oynattıysa bir sonraki görünüşte yeniden
            // kendiliğinden başlamasın.
            intentRef.current = "auto";
          }}
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration;
            if (Number.isFinite(value)) setDuration(value);
          }}
        >
          {orderedSources(sources).map((source) => (
            <source key={source.src} src={source.src} type={source.type} media={source.media} />
          ))}
        </video>
      </div>

      <button
        type="button"
        className={styles.pill}
        aria-controls={videoId}
        aria-label={action}
        onClick={toggle}
      >
        <span className={styles.pillLabel}>
          {playing ? tLab("pause") : tLab("watch")}
          {duration !== null ? <span className={styles.pillTime}> {formatTime(duration)}</span> : null}
        </span>
        <span className={styles.pillIcon} aria-hidden="true">
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="6" width="3.2" height="12" />
              <rect x="13.8" y="6" width="3.2" height="12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
