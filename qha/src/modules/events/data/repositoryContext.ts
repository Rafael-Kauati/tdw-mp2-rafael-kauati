import { createContext, useContext } from 'react';
import type { EventsRepository } from './eventsRepository';

/**
 * Inversão de dependência: o módulo não sabe QUAL repositório usa (URL, proxy,
 * backend futuro). Quem monta a aplicação fornece-o através do Provider.
 */
export const EventsRepositoryContext = createContext<EventsRepository | null>(null);

export function useEventsRepository(): EventsRepository {
  const repository = useContext(EventsRepositoryContext);
  if (!repository) {
    throw new Error(
      'useEventsRepository tem de ser usado dentro de <EventsRepositoryProvider>.',
    );
  }
  return repository;
}
