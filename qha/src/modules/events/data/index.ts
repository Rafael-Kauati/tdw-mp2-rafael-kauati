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
