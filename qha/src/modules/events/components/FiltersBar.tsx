import { useId } from 'react';
import { Button } from '../../ui';
import {
  genreLabel,
  hasActiveFilters,
  SORT_OPTIONS,
  WHEN_OPTIONS,
  type EventFilters,
  type Facets,
} from '../domain';
import { SearchBox } from './SearchBox';
import styles from './FiltersBar.module.css';

interface SelectFieldProps {
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
  /** Se definido, acrescenta uma opção vazia (ex.: "Todos"). */
  emptyLabel?: string;
}

function SelectField({ label, value, options, onChange, emptyLabel }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select id={id} className={styles.control} value={value} onChange={(event) => onChange(event.target.value)}>
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FiltersBarProps {
  filters: EventFilters;
  facets: Facets;
  onChange: (patch: Partial<EventFilters>) => void;
  onReset: () => void;
}

/** Controlos de pesquisa, filtros e ordenação. Só props: quem o usa decide onde guardar o estado (aqui, o URL). */
export function FiltersBar({ filters, facets, onChange, onReset }: FiltersBarProps) {
  const freeId = useId();

  return (
    <section className={styles.bar} aria-label="Pesquisa e filtros">
      <SearchBox value={filters.q} onSearch={(q) => onChange({ q })} />

      <SelectField
        label="Quando"
        value={filters.when}
        options={WHEN_OPTIONS}
        onChange={(value) => {
          const when = WHEN_OPTIONS.find((option) => option.value === value);
          if (when) onChange({ when: when.value });
        }}
      />

      <SelectField
        label="Distrito"
        value={filters.distrito ?? ''}
        emptyLabel="Todos"
        options={facets.distritos.map((option) => ({
          value: option.value,
          label: `${option.value} (${option.count})`,
        }))}
        onChange={(value) => onChange({ distrito: value || null })}
      />

      <SelectField
        label="Género"
        value={filters.genre ?? ''}
        emptyLabel="Todos"
        options={facets.genres.map((option) => ({
          value: option.value,
          label: `${genreLabel(option.value)} (${option.count})`,
        }))}
        onChange={(value) => onChange({ genre: value || null })}
      />

      <SelectField
        label="Ordenar por"
        value={filters.sort}
        options={SORT_OPTIONS}
        onChange={(value) => {
          const sort = SORT_OPTIONS.find((option) => option.value === value);
          if (sort) onChange({ sort: sort.value });
        }}
      />

      <div className={styles.actions}>
        <label htmlFor={freeId} className={styles.checkbox}>
          <input
            id={freeId}
            type="checkbox"
            checked={filters.freeOnly}
            onChange={(event) => onChange({ freeOnly: event.target.checked })}
          />
          Só entrada livre
        </label>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" onClick={onReset}>
            Limpar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
