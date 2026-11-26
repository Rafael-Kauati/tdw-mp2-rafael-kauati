import { InvalidFeedError } from '../domain';

/** fetch() rejeitou: sem rede, DNS, ou pedido bloqueado (CORS aparece assim). */
export class EventsNetworkError extends Error {
  constructor() {
    super('Não foi possível contactar o servidor de eventos.');
    this.name = 'EventsNetworkError';
  }
}

/** O servidor respondeu, mas com um estado de erro (4xx/5xx). */
export class EventsHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`O servidor de eventos respondeu com o estado ${status}.`);
    this.name = 'EventsHttpError';
    this.status = status;
  }
}

/** Só vale a pena repetir falhas temporárias; dados inválidos ou 404 não mudam à segunda. */
export function isRetryableEventsError(error: unknown): boolean {
  if (error instanceof EventsNetworkError) return true;
  if (error instanceof EventsHttpError) {
    return error.status >= 500 || error.status === 429;
  }
  return false;
}

export interface EventsErrorMessage {
  title: string;
  description: string;
}

/** Converte qualquer erro numa mensagem legível para mostrar ao utilizador. */
export function describeEventsError(error: unknown): EventsErrorMessage {
  if (error instanceof EventsNetworkError) {
    return {
      title: 'Sem ligação ao servidor',
      description: 'Verifica a tua ligação à Internet e tenta novamente.',
    };
  }
  if (error instanceof EventsHttpError) {
    return {
      title: 'O servidor não respondeu bem',
      description: `Código ${error.status}. Tenta novamente daqui a pouco.`,
    };
  }
  if (error instanceof InvalidFeedError) {
    return {
      title: 'Dados inesperados',
      description: 'O formato dos eventos mudou ou está corrompido.',
    };
  }
  return {
    title: 'Algo correu mal',
    description: 'Ocorreu um erro inesperado. Tenta novamente.',
  };
}
