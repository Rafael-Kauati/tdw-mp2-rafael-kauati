/** API pública do módulo de eventos. O resto da app (e o projeto maior) importa só daqui. */
export * from './domain';
export { createHttpEventsRepository } from './data/eventsRepository';
export type { EventsRepository } from './data/eventsRepository';
export { EventsRepositoryProvider } from './data/EventsRepositoryProvider';
export { useEventsFeed, useEvent, eventsFeedQueryOptions, eventsKeys } from './data/queries';
export {
  describeEventsError,
  EventsHttpError,
  EventsNetworkError,
  isRetryableEventsError,
} from './data/errors';
export type { EventsErrorMessage } from './data/errors';
export { EventDetail } from './components/EventDetail';
export { formatEventDates, formatPrice } from './components/format';
export { EventCard } from './components/EventCard';
export { EventList } from './components/EventList';
export { EventListSkeleton } from './components/EventListSkeleton';
export { FiltersBar } from './components/FiltersBar';
export { Pagination } from './components/Pagination';
export type { EventLinkComponent, EventLinkProps } from './components/types';
