import type { ReactNode } from 'react';
import type { EventsRepository } from './eventsRepository';
import { EventsRepositoryContext } from './repositoryContext';

interface EventsRepositoryProviderProps {
  repository: EventsRepository;
  children: ReactNode;
}

export function EventsRepositoryProvider({
  repository,
  children,
}: EventsRepositoryProviderProps) {
  return (
    <EventsRepositoryContext.Provider value={repository}>
      {children}
    </EventsRepositoryContext.Provider>
  );
}
