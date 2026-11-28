/** API pública do módulo de domínio. O resto da app importa só daqui. */
export type { Event, EventsFeed, FeedStats, DistritoStats, Coordinates } from './types';
export { parseEventsFeed, InvalidFeedError } from './feed';
export { genreLabel } from './genres';
export { foldForSearch } from './clean';
export { todayInLisbon } from './calendar';
export {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  WHEN_OPTIONS,
  computeFacets,
  filterEvents,
  hasActiveFilters,
  sortEvents,
} from './filters';
export type { EventFilters, FacetOption, Facets, SortKey, WhenKey } from './filters';
export { applyFilterPatch, parseFilters, serializeFilters } from './searchParams';
export { paginate } from './paginate';
export type { Page } from './paginate';
