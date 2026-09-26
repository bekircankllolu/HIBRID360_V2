import { ALL, type WorkFilters } from "./work-inventory";
import styles from "./WorkInventory.module.css";

export interface WorkFilterOptions {
  year: readonly number[];
  service: readonly string[];
  industry: readonly string[];
}

export interface WorkFilterLabels {
  group: string;
  year: string;
  service: string;
  industry: string;
  all: string;
  clear: string;
}

/**
 * "Filtreler" hapının açtığı panel: mevcut üç süzgeç (yıl · hizmet ·
 * sektör) korunuyor, yalnızca görünüm monks hap diline geçti. Yerel
 * `<select>` bilinçli: klavye, ekran okuyucu ve mobil seçici bedava.
 */
export function WorkFilterPanel({
  id,
  filters,
  options,
  labels,
  onChange,
  onClear,
}: {
  id: string;
  filters: WorkFilters;
  options: WorkFilterOptions;
  labels: WorkFilterLabels;
  onChange: (key: keyof WorkFilters, value: string) => void;
  onClear: () => void;
}) {
  const fields: { key: keyof WorkFilters; label: string; values: readonly (string | number)[] }[] = [
    { key: "year", label: labels.year, values: options.year },
    { key: "service", label: labels.service, values: options.service },
    { key: "industry", label: labels.industry, values: options.industry },
  ];
  const hasActive = Object.values(filters).some((value) => value !== ALL);

  return (
    <div id={id} className={styles.panel} role="group" aria-label={labels.group}>
      {fields.map(({ key, label, values }) => (
        <label key={key} className={styles.field} data-active={filters[key] !== ALL || undefined}>
          <span className={styles.fieldLabel}>{label}</span>
          <select
            value={filters[key]}
            onChange={(event) => onChange(key, event.target.value)}
            disabled={values.length === 0}
          >
            <option value={ALL}>{labels.all}</option>
            {values.map((value) => (
              <option key={value} value={String(value)}>
                {value}
              </option>
            ))}
          </select>
        </label>
      ))}
      {hasActive && (
        <button type="button" className={styles.clear} onClick={onClear}>
          {labels.clear}
        </button>
      )}
    </div>
  );
}
