import { DEFAULT_FILTERS, SORT_OPTIONS, WHEN_OPTIONS, type EventFilters, type SortKey, type WhenKey } from './filters';

/**
 * URL ⇄ filtros. O URL é a fonte de verdade: qualquer valor vindo dele pode estar
 * errado (editado à mão, link antigo), por isso tudo é validado e cai no valor por defeito.
 * Valores por defeito não aparecem no URL, para os links serem curtos.
 *
 *   ?q=fado&distrito=Porto&genero=fado&quando=fim-de-semana&gratis=1&ordem=data&pagina=2
 */

const MAX_QUERY_LENGTH = 100;

function isWhenKey(value: string | null): value is WhenKey {
  return WHEN_OPTIONS.some((option) => option.value === value);
}

function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function nonEmpty(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function parseFilters(params: URLSearchParams): EventFilters {
  const when = params.get('quando');
  const sort = params.get('ordem');

  return {
    q: (params.get('q') ?? '').trim().slice(0, MAX_QUERY_LENGTH),
    distrito: nonEmpty(params.get('distrito')),
    genre: nonEmpty(params.get('genero')),
    when: isWhenKey(when) ? when : DEFAULT_FILTERS.when,
    freeOnly: params.get('gratis') === '1',
    sort: isSortKey(sort) ? sort : DEFAULT_FILTERS.sort,
    page: parsePage(params.get('pagina')),
  };
}

export function serializeFilters(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.distrito) params.set('distrito', filters.distrito);
  if (filters.genre) params.set('genero', filters.genre);
  if (filters.when !== DEFAULT_FILTERS.when) params.set('quando', filters.when);
  if (filters.freeOnly) params.set('gratis', '1');
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('ordem', filters.sort);
  if (filters.page > 1) params.set('pagina', String(filters.page));
  return params;
}

/** Mudar qualquer filtro volta à página 1 (a 3.ª página de uma pesquisa antiga já não faz sentido). */
export function applyFilterPatch(current: EventFilters, patch: Partial<EventFilters>): EventFilters {
  return { ...current, ...patch, page: patch.page ?? 1 };
}
