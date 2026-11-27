import type { Event, EventsFeed, FeedStats } from './types';
import { rawEventSchema, rawFeedSchema, rawStatsSchema, type RawStats } from './schema';
import { normalizeEvent } from './normalize';

export class InvalidFeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFeedError';
  }
}

function toFeedStats(raw: RawStats): FeedStats {
  return {
    totalEvents: raw.total_events,
    activeVenues: raw.active_venues,
    activeConcelhos: raw.active_concelhos,
    activeDistritos: raw.active_distritos,
    distritos: raw.distritos,
    byDistrito: raw.by_distrito,
    totalVenuesInCatalog: raw.total_venues_in_catalog,
  };
}

/**
 * Ficheiro JSON completo → EventsFeed.
 * - Evento individual mau ou duplicado → é descartado e contado em skippedCount.
 */
export function parseEventsFeed(json: unknown): EventsFeed {
  const feed = rawFeedSchema.safeParse(json);
  if (!feed.success) {
    throw new InvalidFeedError('O ficheiro de eventos não tem o formato esperado.');
  }

  const events: Event[] = [];
  const seenIds = new Set<string>();
  let skippedCount = 0;

  for (const item of feed.data.events) {
    const raw = rawEventSchema.safeParse(item);
    const event = raw.success ? normalizeEvent(raw.data) : null;

    if (!event || seenIds.has(event.id)) {
      skippedCount += 1;
      continue;
    }
    seenIds.add(event.id);
    events.push(event);
  }

  // Se havia eventos e nenhum sobreviveu, o formato mudou: é erro, não "lista vazia".
  if (feed.data.events.length > 0 && events.length === 0) {
    throw new InvalidFeedError('Nenhum evento do ficheiro pôde ser interpretado.');
  }

  const stats = rawStatsSchema.safeParse(feed.data.stats);

  return {
    events,
    stats: stats.success ? toFeedStats(stats.data) : null,
    generatedAt: feed.data.generated_at ?? null,
    skippedCount,
  };
}