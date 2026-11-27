/**
 * Excerto reduzido do formato real de https://www.nocartaz.pt/events.json,
 * escolhido para cobrir os casos "feios" da fonte.
 */

/** Evento completo (estilo Fever): imagem, preço, coordenadas, tags, ruído na descrição. */
export const fullEvent = {
    id: "fever-pena-001",
    venue_id: "venue-pena",
    title: "Palácio da Pena: Visita Guiada",
    starts_at: "2026-11-17T09:30:00+00:00",
    ends_at: "2027-02-13T17:30:00+00:00",
    url: "https://feverup.com/m/117180",
    description:
      "Descubra o palácio.\r\n\r\nBilhetes BlackFriday2026\r\n.hidden-word { display: none; }\r\nVisita de 90 minutos.",
    image_url: "https://example.com/pena.jpg",
    price_min: 18,
    sold_out: 0,
    genre: "Outro",
    tags: ["visita", " patrimonio "],
    relevance_score: 7,
    lat: 38.7876,
    lon: -9.3906,
    address: "Estrada da Pena, Sintra",
    distrito: "Lisboa",
    concelho: "Sintra",
    venue_name: "Palácio da Pena",
    pitch: "Uma visita inesquecível.",
    first_seen_at: "2026-11-01T10:00:00+00:00",
    notified: false,
    venue_priority: 2,
    capacity_tier: "large",
  };
  
  /** Evento mínimo: sem fuso, sem fim, sem imagem, preço, coordenadas, tags... */
  export const minimalEvent = {
    id: "museu-ciencia-001",
    title: "Visita ao Museu da Ciência",
    starts_at: "2026-01-01T00:00:00",
  };
  
  /** Título em Unicode "a negrito" com acentos soltos. */
  export const boldTitleEvent = {
    id: "angra-001",
    title: "𝗘𝘅𝗽𝗼𝘀𝗶𝗰̧𝗮̃𝗼 𝗱𝗲 𝗙𝗼𝘁𝗼𝗴𝗿𝗮𝗳𝗶𝗮 | 𝗥𝗼𝗺𝗮𝗿𝗶𝗮 𝗖𝗶𝗴𝗮𝗻𝗮",
    starts_at: "2026-12-01T00:00:00+00:00",
    genre: "exposicao",
    distrito: "Açores",
    concelho: "Angra do Heroísmo",
  };
  
  /** Descrição de preenchimento e campos a null (como "pitch": null na fonte). */
  export const loremEvent = {
    id: "se-guarda-001",
    title: "Visita à Sé da Guarda",
    starts_at: "2026-03-05T00:00:00+00:00",
    ends_at: "2028-03-05T00:00:00+00:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    pitch: null,
    image_url: null,
    price_min: null,
    relevance_score: 5,
  };
  
  /** Descrição com muitas linhas vazias e bullets. */
  export const messyDescriptionEvent = {
    id: "sa-bandeira-001",
    title: "Camões em Palco",
    starts_at: "2027-07-30T21:00:00+01:00",
    ends_at: "2027-07-31T00:00:00+01:00",
    description:
      "Mais Novos • M/12\n  \n\n\n\n\nDescrição\n\n\n\nLuís Vaz de Camões, já ouviram falar?",
    genre: "teatro",
    venue_name: "Teatro Sá da Bandeira",
    concelho: "Santarém",
    distrito: "Santarém",
  };
  
  export const rawStats = {
    total_events: 6,
    active_venues: 5,
    active_concelhos: 4,
    active_distritos: 3,
    distritos: ["Açores", "Lisboa", "Santarém"],
    by_distrito: {
      Lisboa: { events: 3, venues: 2, concelhos: 2 },
      Santarém: { events: 1, venues: 1, concelhos: 1 },
    },
    total_venues_in_catalog: 120,
  };
  
  export const rawEvents = [
    fullEvent,
    minimalEvent,
    boldTitleEvent,
    loremEvent,
    messyDescriptionEvent,
  ];
  
  export const rawFeed = {
    generated_at: "2026-11-25T08:00:00+00:00",
    stats: rawStats,
    events: rawEvents,
  };