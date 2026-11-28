import { foldForSearch } from './clean';
import { addDays, weekendRange } from './calendar';
import type { Event } from './types';

export type WhenKey = 'proximos' | 'hoje' | 'fim-de-semana' | '7-dias' | 'todos';
export type SortKey = 'relevancia' | 'data' | 'recentes';

/** Tudo o que o utilizador pode escolher na listagem. É isto que vive no URL. */
export interface EventFilters {
  q: string;
  distrito: string | null;
  genre: string | null;
  when: WhenKey;
  freeOnly: boolean;
  sort: SortKey;
  page: number;
}

export const DEFAULT_FILTERS: EventFilters = {
  q: '',
  distrito: null,
  genre: null,
  when: 'proximos',
  freeOnly: false,
  sort: 'relevancia',
  page: 1,
};

export const WHEN_OPTIONS: ReadonlyArray<{ value: WhenKey; label: string }> = [
  { value: 'proximos', label: 'Em cartaz e próximos' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'fim-de-semana', label: 'Este fim de semana' },
  { value: '7-dias', label: 'Próximos 7 dias' },
  { value: 'todos', label: 'Todas as datas' },
];

export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'relevancia', label: 'Mais relevantes' },
  { value: 'data', label: 'Mais próximos' },
  { value: 'recentes', label: 'Adicionados recentemente' },
];

const collator = new Intl.Collator('pt');

// ---------- filtrar ----------

/** Um evento "acontece" num intervalo se os dois intervalos de dias se sobrepõem. */
function overlaps(event: Event, from: string, to: string): boolean {
  return event.startDate <= to && event.endDate >= from;
}

/** Constrói o teste uma só vez (e não por evento): o intervalo do fim de semana calcula-se uma vez. */
function buildWhenPredicate(when: WhenKey, today: string): (event: Event) => boolean {
  switch (when) {
    case 'todos':
      return () => true;
    case 'proximos':
      return (event) => event.endDate >= today;
    case 'hoje':
      return (event) => overlaps(event, today, today);
    case 'fim-de-semana': {
      const [from, to] = weekendRange(today);
      return (event) => overlaps(event, from, to);
    }
    case '7-dias': {
      const to = addDays(today, 6);
      return (event) => overlaps(event, today, to);
    }
  }
}

/** `today` é um parâmetro (e não `new Date()` aqui dentro) para a função continuar pura e testável. */
export function filterEvents(events: Event[], filters: EventFilters, today: string): Event[] {
  const matchesWhen = buildWhenPredicate(filters.when, today);
  const tokens = foldForSearch(filters.q).split(/\s+/).filter(Boolean);

  return events.filter(
    (event) =>
      matchesWhen(event) &&
      (!filters.distrito || event.distrito === filters.distrito) &&
      (!filters.genre || event.genre === filters.genre) &&
      (!filters.freeOnly || event.priceMin === 0) &&
      tokens.every((token) => event.searchText.includes(token)),
  );
}

// ---------- ordenar ----------

/** Um evento em cartaz desde 2023 conta como "hoje", não como 2023. */
function effectiveStart(event: Event, today: string): string {
  return event.startDate > today ? event.startDate : today;
}

function compareStart(a: Event, b: Event, today: string): number {
  const first = effectiveStart(a, today);
  const second = effectiveStart(b, today);
  return first < second ? -1 : first > second ? 1 : 0;
}

function firstSeenTime(event: Event): number {
  return event.firstSeenAt ? Date.parse(event.firstSeenAt) || 0 : 0;
}

export function sortEvents(events: Event[], sort: SortKey, today: string): Event[] {
  const copy = [...events];
  switch (sort) {
    case 'relevancia':
      return copy.sort(
        (a, b) =>
          b.relevanceScore - a.relevanceScore ||
          compareStart(a, b, today) ||
          collator.compare(a.title, b.title),
      );
    case 'data':
      return copy.sort(
        (a, b) =>
          compareStart(a, b, today) ||
          b.relevanceScore - a.relevanceScore ||
          collator.compare(a.title, b.title),
      );
    case 'recentes':
      return copy.sort(
        (a, b) => firstSeenTime(b) - firstSeenTime(a) || b.relevanceScore - a.relevanceScore,
      );
  }
}

// ---------- facetas (contagens por opção) ----------

export interface FacetOption {
  value: string;
  count: number;
}

export interface Facets {
  distritos: FacetOption[];
  genres: FacetOption[];
}

function countBy(events: Event[], key: (event: Event) => string | null): FacetOption[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    const value = key(event);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([value, count]) => ({ value, count }));
}

/** Se a opção escolhida já não tem resultados, continua visível (com 0) em vez de desaparecer do campo. */
function keepSelected(options: FacetOption[], selected: string | null): FacetOption[] {
  if (!selected || options.some((option) => option.value === selected)) return options;
  return [...options, { value: selected, count: 0 }];
}

/**
 * Contagens "à Amazon": as opções de distrito contam os eventos que passam em
 * TODOS os filtros menos o próprio distrito (e o mesmo para o género). Assim
 * cada opção mostra quantos resultados daria se fosse escolhida.
 */
export function computeFacets(events: Event[], filters: EventFilters, today: string): Facets {
  const forDistrito = filterEvents(events, { ...filters, distrito: null }, today);
  const forGenre = filterEvents(events, { ...filters, genre: null }, today);

  const distritos = countBy(forDistrito, (event) => event.distrito).sort((a, b) =>
    collator.compare(a.value, b.value),
  );
  const genres = countBy(forGenre, (event) => event.genre).sort(
    (a, b) => b.count - a.count || collator.compare(a.value, b.value),
  );

  return {
    distritos: keepSelected(distritos, filters.distrito),
    genres: keepSelected(genres, filters.genre),
  };
}

/** Pesquisa, distrito, género, data e preço contam como "filtros"; a ordenação não. */
export function hasActiveFilters(filters: EventFilters): boolean {
  return (
    filters.q !== '' ||
    filters.distrito !== null ||
    filters.genre !== null ||
    filters.freeOnly ||
    filters.when !== DEFAULT_FILTERS.when
  );
}
