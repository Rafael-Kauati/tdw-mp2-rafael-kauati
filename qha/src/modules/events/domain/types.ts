/**
 * Modelo NORMALIZADO de um evento: é o que o resto da aplicação (e o projeto
 * maior) deve usar. Nunca se usa o formato bruto da API fora do domínio.
 */

export interface Coordinates {
    lat: number;
    lon: number;
  }
  
  export interface Event {
    id: string;
    title: string;
    description: string | null;
    pitch: string | null;
  
    /** Dia de início em hora de Lisboa, formato YYYY-MM-DD (comparável como texto). */
    startDate: string;
    /** Dia de fim (nunca anterior a startDate). Eventos de um só dia: igual a startDate. */
    endDate: string;
    /** HH:mm em hora de Lisboa; null quando a API só dá 00:00 (hora desconhecida). */
    startTime: string | null;
  
    /** Texto aberto (minúsculas): a API pode ter géneros que ainda não vimos. */
    genre: string;
    tags: string[];
  
    distrito: string | null;
    concelho: string | null;
    venueId: string | null;
    venueName: string | null;
    address: string | null;
    coordinates: Coordinates | null;
  
    priceMin: number | null;
    soldOut: boolean;
    imageUrl: string | null;
    /** Link para a página original do evento (sempre http/https). */
    sourceUrl: string | null;
  
    relevanceScore: number;
    firstSeenAt: string | null;
  
    /** Texto já sem acentos e em minúsculas, pré-calculado para a pesquisa. */
    searchText: string;
  }
  
  export interface DistritoStats {
    events: number;
    venues: number;
    concelhos: number;
  }
  
  export interface FeedStats {
    totalEvents: number;
    activeVenues: number;
    activeConcelhos: number;
    activeDistritos: number;
    distritos: string[];
    byDistrito: Record<string, DistritoStats>;
    totalVenuesInCatalog: number;
  }
  
  export interface EventsFeed {
    events: Event[];
    stats: FeedStats | null;
    generatedAt: string | null;
    /** Eventos descartados por estarem malformados ou duplicados. */
    skippedCount: number;
  }