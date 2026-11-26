import type { Coordinates, Event } from './types';
import type { RawEvent } from './schema';
import { cleanDescription, cleanTitle, foldForSearch, toHttpUrl, trimOrNull } from './clean';
import { toLisbonDateTime } from './dates';

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

  const venueName = trimOrNull(raw.venue_name);
  const concelho = trimOrNull(raw.concelho);
  const distrito = trimOrNull(raw.distrito);
  const tags = (raw.tags ?? []).map((tag) => tag.trim()).filter(Boolean);

  return {
    id: raw.id,
    title,
    description: cleanDescription(raw.description),
    pitch: trimOrNull(raw.pitch),

    startDate: start.date,
    endDate,
    // A API usa 00:00 quando não conhece a hora.
    startTime: start.time === '00:00' ? null : start.time,

    genre: trimOrNull(raw.genre)?.toLowerCase() ?? 'outro',
    tags,

    distrito,
    concelho,
    venueId: trimOrNull(raw.venue_id),
    venueName,
    address: trimOrNull(raw.address),
    coordinates: toCoordinates(raw.lat, raw.lon),

    priceMin:
      typeof raw.price_min === 'number' && raw.price_min >= 0 ? raw.price_min : null,
    soldOut: Boolean(raw.sold_out),
    imageUrl: toHttpUrl(raw.image_url),
    sourceUrl: toHttpUrl(raw.url),

    relevanceScore: raw.relevance_score ?? 0,
    firstSeenAt: trimOrNull(raw.first_seen_at),

    searchText: foldForSearch(
      [title, venueName, concelho, distrito, ...tags].filter(Boolean).join(' '),
    ),
  };
}