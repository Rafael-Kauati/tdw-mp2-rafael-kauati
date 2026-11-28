import type { Coordinates, Event } from './types';
import type { RawEvent } from './schema';
import { cleanDescription, cleanTitle, foldForSearch, toHttpUrl, trimOrNull } from './clean';
import { toLisbonDateTime } from './dates';
import { genreLabel } from './genres';

function toCoordinates(
  lat: number | null | undefined,
  lon: number | null | undefined,
): Coordinates | null {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

/**
 * Texto onde a pesquisa procura: sem acentos e em minúsculas. Inclui o género
 * (para "teatro" ou "fado" encontrarem eventos desse género mesmo sem a palavra
 * no título), exceto "outro", que só acrescentaria ruído.
 * É a ÚNICA definição: os testes dos filtros usam esta mesma função.
 */
export function buildSearchText(
  event: Pick<Event, 'title' | 'venueName' | 'concelho' | 'distrito' | 'genre' | 'tags'>,
): string {
  const genre = event.genre === 'outro' ? null : genreLabel(event.genre);
  return foldForSearch(
    [event.title, event.venueName, event.concelho, event.distrito, genre, ...event.tags]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * Evento bruto (já validado pelo zod) → Event normalizado.
 * Devolve null quando o evento é inutilizável (sem data válida ou sem título).
 */
export function normalizeEvent(raw: RawEvent): Event | null {
  const title = cleanTitle(raw.title);
  const start = toLisbonDateTime(raw.starts_at);
  if (!title || !start) return null;

  const end = raw.ends_at ? toLisbonDateTime(raw.ends_at) : null;
  // Fim ausente, inválido ou anterior ao início → evento de um só dia.
  const endDate = end && end.date >= start.date ? end.date : start.date;

  const event: Omit<Event, 'searchText'> = {
    id: raw.id,
    title,
    description: cleanDescription(raw.description),
    pitch: trimOrNull(raw.pitch),

    startDate: start.date,
    endDate,
    // A API usa 00:00 quando não conhece a hora.
    startTime: start.time === '00:00' ? null : start.time,

    genre: trimOrNull(raw.genre)?.toLowerCase() ?? 'outro',
    tags: (raw.tags ?? []).map((tag) => tag.trim()).filter(Boolean),

    distrito: trimOrNull(raw.distrito),
    concelho: trimOrNull(raw.concelho),
    venueId: trimOrNull(raw.venue_id),
    venueName: trimOrNull(raw.venue_name),
    address: trimOrNull(raw.address),
    coordinates: toCoordinates(raw.lat, raw.lon),

    priceMin:
      typeof raw.price_min === 'number' && raw.price_min >= 0 ? raw.price_min : null,
    soldOut: Boolean(raw.sold_out),
    imageUrl: toHttpUrl(raw.image_url),
    sourceUrl: toHttpUrl(raw.url),

    relevanceScore: raw.relevance_score ?? 0,
    firstSeenAt: trimOrNull(raw.first_seen_at),
  };

  return { ...event, searchText: buildSearchText(event) };
}
