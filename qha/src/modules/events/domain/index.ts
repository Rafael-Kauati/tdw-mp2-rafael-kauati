/** API pública do módulo de domínio. O resto da app importa só daqui. */
export type { Event, EventsFeed, FeedStats, DistritoStats, Coordinates } from './types';
export { parseEventsFeed, InvalidFeedError } from './feed';
export { genreLabel } from './genres';
export { foldForSearch } from './clean';