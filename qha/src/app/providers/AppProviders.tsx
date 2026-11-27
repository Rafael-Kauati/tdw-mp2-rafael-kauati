import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createHttpEventsRepository, EventsRepositoryProvider } from '../../modules/events';
import { eventsUrl } from '../config';

// Criados fora do componente: têm de ser os mesmos entre renders.
const queryClient = new QueryClient();
const eventsRepository = createHttpEventsRepository(eventsUrl);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EventsRepositoryProvider repository={eventsRepository}>
        {children}
      </EventsRepositoryProvider>
    </QueryClientProvider>
  );
}