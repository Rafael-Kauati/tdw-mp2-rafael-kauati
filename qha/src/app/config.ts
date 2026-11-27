const DEFAULT_EVENTS_URL = 'https://www.nocartaz.pt/events.json';

/**
 * Fonte dos eventos. Em caso de bloqueio CORS, define VITE_EVENTS_URL=/api/events.json
 * e configura um proxy (ver .env.example). Ler variáveis de ambiente fica na app,
 * nunca no módulo, para o módulo funcionar noutros bundlers (ex.: Next.js).
 */
export const eventsUrl: string = import.meta.env.VITE_EVENTS_URL ?? DEFAULT_EVENTS_URL;