"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { Work } from "@/types/content";
import { WorkCaseCard, WorkCaseCardSkeleton } from "./WorkCaseCard";
import { WorkFilterPanel } from "./WorkFilterPanel";
import { WorkIndexTable, type WorkIndexRow } from "./WorkIndexTable";
import {
  ALL,
  EMPTY_FILTERS,
  FEATURED_LIMIT,
  PAGE_SIZE,
  activeFilterCount,
  filterWorks,
  optionsOf,
  pickFeatured,
  workTitle,
  yearsOf,
  type Locale,
  type WorkFilters,
} from "./work-inventory";
import styles from "./WorkInventory.module.css";

/**
 * LAB — monks.com "work inventory" düzeni:
 *   sayaç + "Filtreler" hapı → öne çıkan 3 kart → Müşteri | Proje | Hizmetler
 *   dizini → "Daha fazla göster".
 *
 * Eski `WorkArchive`'in üç süzgeci (yıl · hizmet · sektör) ve `?service=`
 * ile gelen ön seçim aynen korunuyor. Envanter boşken (Supabase verisi
 * gelmeden) düzen çerçeve olarak görünür; hiçbir müşteri/proje uydurulmaz.
 */
export function WorkInventory({
  works,
  locale,
  confidentialLabel,
  initialService = ALL,
}: {
  works: Work[];
  locale: Locale;
  confidentialLabel: string;
  initialService?: string;
}) {
  const t = useTranslations("lab.works");
  const tWork = useTranslations("work");
  const tFilter = useTranslations("work.filter");
  const tCommon = useTranslations("common");
  const panelId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<WorkFilters>({ ...EMPTY_FILTERS, service: initialService });
  const [panelOpen, setPanelOpen] = useState(initialService !== ALL);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const options = useMemo(
    () => ({
      year: yearsOf(works),
      service: optionsOf(works, (work) => work.service),
      industry: optionsOf(works, (work) => work.industry),
    }),
    [works],
  );
  const filtered = useMemo(() => filterWorks(works, filters), [works, filters]);
  const featured = useMemo(() => pickFeatured(works), [works]);
  const active = activeFilterCount(filters);

  const toRow = (work: Work): WorkIndexRow => ({
    work,
    client: work.client_name ?? confidentialLabel,
    title: workTitle(work, locale, tWork("projectFallback")),
  });
  const rows = filtered.slice(0, visible).map(toRow);
  const moreLabel = (count: number) => t("moreSolutions", { count });

  // "Daha fazla göster" sonrası odak ilk yeni satıra geçer; klavye
  // kullanıcısı listenin başına dönmek zorunda kalmaz.
  useEffect(() => {
    if (focusIndex === null) return;
    const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("li > a");
    links?.[focusIndex]?.focus();
    setFocusIndex(null);
  }, [focusIndex, visible]);

  const updateFilter = (key: keyof WorkFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setVisible(PAGE_SIZE);
  };
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setVisible(PAGE_SIZE);
  };
  const loadMore = () => {
    setFocusIndex(visible);
    setVisible((current) => current + PAGE_SIZE);
  };

  const inventoryEmpty = works.length === 0;

  return (
    <div className={styles.inventory}>
      <div className={styles.toolbar}>
        <p className={styles.counter} aria-live="polite">
          {t.rich("showing", {
            count: filtered.length,
            n: (chunks) => <span className={styles.countPill}>{chunks}</span>,
          })}
        </p>
        <button
          type="button"
          className={styles.filterToggle}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          onClick={() => setPanelOpen((open) => !open)}
        >
          <span className={styles.filterLabel}>
            {t("filters")}
            <span className={styles.filterCount}>
              <span aria-hidden="true">{active}</span>
              <span className={styles.srOnly}>{t("activeFilters", { count: active })}</span>
            </span>
          </span>
          <span className={styles.filterIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
              <circle cx="15" cy="8" r="2" />
              <circle cx="9" cy="16" r="2" />
            </svg>
          </span>
        </button>
      </div>

      {panelOpen && (
        <WorkFilterPanel
          id={panelId}
          filters={filters}
          options={options}
          labels={{
            group: tFilter("label"),
            year: tFilter("year"),
            service: tFilter("service"),
            industry: tFilter("industry"),
            all: tFilter("all"),
            clear: t("clearFilters"),
          }}
          onChange={updateFilter}
          onClear={clearFilters}
        />
      )}

      <section className={styles.popular} aria-labelledby={`${panelId}-popular`}>
        <h2 id={`${panelId}-popular`} className={styles.sideLabel}>
          {inventoryEmpty || featured.curated ? t("popular") : tWork("recentTitle")}
        </h2>
        <div className={styles.cards}>
          {inventoryEmpty
            ? Array.from({ length: FEATURED_LIMIT }, (_, index) => <WorkCaseCardSkeleton key={index} />)
            : featured.works.map((work) => {
                const row = toRow(work);
                return (
                  <WorkCaseCard
                    key={work.id}
                    work={work}
                    client={row.client}
                    title={row.title}
                    moreLabel={moreLabel}
                  />
                );
              })}
        </div>
      </section>

      <section className={styles.index} aria-labelledby={`${panelId}-index`} ref={listRef}>
        <h2 id={`${panelId}-index`} className={styles.srOnly}>
          {t("indexTitle")}
        </h2>
        <WorkIndexTable
          rows={rows}
          skeletonRows={inventoryEmpty ? 4 : 0}
          labels={{
            client: t("colClient"),
            project: t("colProject"),
            solutions: t("colSolutions"),
            more: moreLabel,
          }}
        >
          {inventoryEmpty && (
            <div className={styles.message} data-testid="work-empty-state" role="status">
              <p className={styles.messageStatus}>
                <span className={styles.pulse} aria-hidden="true" />
                {tCommon("pendingLabel")}
              </p>
              <div className={styles.messageText}>
                <p className={styles.messageTitle}>{tWork("empty")}</p>
                <p className={styles.messageDetail}>{tWork("emptyDetail")}</p>
              </div>
            </div>
          )}
          {!inventoryEmpty && filtered.length === 0 && (
            <div className={`${styles.message} ${styles.messageSimple}`} data-testid="work-no-match">
              <p className={styles.messageTitle}>{t("noMatch")}</p>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("clearFilters")}
              </Button>
            </div>
          )}
        </WorkIndexTable>

        {filtered.length > visible && (
          <div className={styles.loadMore}>
            <Button variant="ghost" size="sm" onClick={loadMore}>
              {t("loadMore")}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
