import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Event, EventsFeed } from '../domain';
import { isRetryableEventsError } from './errors';
import type { EventsRepository } from './eventsRepository';
import { useEventsRepository } from './repositoryContext';

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const MAX_RETRIES = 2;

export const eventsKeys = {
  all: ['events'] as const,
  feed: () => [...eventsKeys.all, 'feed'] as const,
};

/**
 * Opções da query do ficheiro completo. Separadas do hook para poderem ser
 * reutilizadas (prefetch, loaders do router, testes sem React).
 *
 * O ficheiro é grande e a API não tem filtros nem detalhe: fazemos UM fetch,
 * guardamo-lo em cache e filtramos no cliente.
 */
export function eventsFeedQueryOptions(repository: EventsRepository) {
  return queryOptions({
    queryKey: eventsKeys.feed(),
    queryFn: ({ signal }) => repository.getFeed(signal),
    staleTime: TEN_MINUTES,
    gcTime: ONE_HOUR,
    refetchOnWindowFocus: false, // evita re-descarregar o ficheiro grande ao trocar de separador
    retry: (failureCount, error) =>
      failureCount < MAX_RETRIES && isRetryableEventsError(error),
  });
}

/** Detalhe = procurar por id na lista já em cache (não existe endpoint de detalhe). */
export function findEventById(feed: EventsFeed, id: string | undefined): Event | null {
  if (!id) return null;
  return feed.events.find((event) => event.id === id) ?? null;
}

export function useEventsFeed() {
  const repository = useEventsRepository();
  return useQuery(eventsFeedQueryOptions(repository));
}

/**
 * `data` é: undefined enquanto carrega, `null` se o id não existe (a página
 * mostra "não encontrado"), ou o evento. Partilha a mesma cache da lista.
 */
export function useEvent(id: string | undefined) {
  const repository = useEventsRepository();
  return useQuery({
    ...eventsFeedQueryOptions(repository),
    select: (feed) => findEventById(feed, id),
  });
}
