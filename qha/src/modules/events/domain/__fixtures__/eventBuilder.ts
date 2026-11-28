import { buildSearchText } from '../normalize';
import type { Event } from '../types';

/** Cria um Event NORMALIZADO completo para os testes; só se indica o que interessa a cada teste. */
export function makeEvent(overrides: Partial<Event> & { id: string }): Event {
  const base: Event = {
    id: overrides.id,
    title: `Evento ${overrides.id}`,
    description: null,
    pitch: null,
    startDate: '2026-12-01',
    endDate: '2026-12-01',
    startTime: null,
    genre: 'outro',
    tags: [],
    distrito: null,
    concelho: null,
    venueId: null,
    venueName: null,
    address: null,
    coordinates: null,
    priceMin: null,
    soldOut: false,
    imageUrl: null,
    sourceUrl: null,
    relevanceScore: 0,
    firstSeenAt: null,
    searchText: '',
  };
  const event = { ...base, ...overrides };
  // Mesma função da normalização: o texto de pesquisa dos testes nunca se afasta do real.
  return { ...event, searchText: overrides.searchText ?? buildSearchText(event) };
}
