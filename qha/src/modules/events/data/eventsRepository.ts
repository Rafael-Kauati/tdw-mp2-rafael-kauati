import { InvalidFeedError, parseEventsFeed, type EventsFeed } from '../domain';
import { EventsHttpError, EventsNetworkError } from './errors';

/**
 * Contrato de acesso aos eventos. A UI e os hooks só conhecem esta interface:
 * trocar o ficheiro JSON por um backend real é escrever outra implementação.
 */
export interface EventsRepository {
  getFeed(signal?: AbortSignal): Promise<EventsFeed>;
}

/** Implementação que lê o ficheiro JSON público do nocartaz. */
export function createHttpEventsRepository(url: string): EventsRepository {
  return {
    async getFeed(signal) {
      let response: Response;
      try {
        response = await fetch(url, { signal });
      } catch (error) {
        // fetch só rejeita com TypeError em falhas de rede/CORS.
        // Um cancelamento (AbortError) NÃO é erro de rede: deixa-se passar.
        if (error instanceof TypeError) throw new EventsNetworkError();
        throw error;
      }

      if (!response.ok) throw new EventsHttpError(response.status);

      let json: unknown;
      try {
        json = await response.json();
      } catch {
        throw new InvalidFeedError('A resposta do servidor não é JSON válido.');
      }

      return parseEventsFeed(json);
    },
  };
}
