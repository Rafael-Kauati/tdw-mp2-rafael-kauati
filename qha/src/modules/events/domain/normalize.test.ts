import { describe, expect, it } from "vitest";
import { normalizeEvent } from "./normalize";
import {
  boldTitleEvent,
  fullEvent,
  loremEvent,
  messyDescriptionEvent,
  minimalEvent,
} from "./__fixtures__/rawFeed";

describe("normalizeEvent (eventos baseados no formato real da API)", () => {
  it("normaliza um evento completo", () => {
    const event = normalizeEvent(fullEvent);

    expect(event).toMatchObject({
      id: "fever-pena-001",
      title: "Palácio da Pena: Visita Guiada",
      startDate: "2026-11-17",
      startTime: "09:30",
      endDate: "2027-02-13",
      genre: "outro",
      tags: ["visita", "patrimonio"],
      priceMin: 18,
      soldOut: false,
      imageUrl: "https://example.com/pena.jpg",
      sourceUrl: "https://feverup.com/m/117180",
      coordinates: { lat: 38.7876, lon: -9.3906 },
      pitch: "Uma visita inesquecível.",
      relevanceScore: 7,
      description: "Descubra o palácio.\n\nBilhetes\n\nVisita de 90 minutos.",
    });
    expect(event?.searchText).toContain("palacio da pena");
    expect(event?.searchText).toContain("sintra");
  });

  it("aplica valores por defeito num evento mínimo", () => {
    expect(normalizeEvent(minimalEvent)).toMatchObject({
      startDate: "2026-01-01",
      endDate: "2026-01-01",
      startTime: null,
      genre: "outro",
      tags: [],
      description: null,
      pitch: null,
      imageUrl: null,
      sourceUrl: null,
      priceMin: null,
      coordinates: null,
      soldOut: false,
      relevanceScore: 0,
      venueName: null,
      distrito: null,
    });
  });

  it("converte o título em Unicode 'a negrito'", () => {
    const event = normalizeEvent(boldTitleEvent);
    expect(event?.title).toBe("Exposição de Fotografia | Romaria Cigana");
    expect(event?.searchText).toContain("exposicao de fotografia");
  });

  it("descarta lorem ipsum e trata null como ausente", () => {
    expect(normalizeEvent(loremEvent)).toMatchObject({
      description: null,
      pitch: null,
      imageUrl: null,
      priceMin: null,
      endDate: "2028-03-05",
    });
  });

  it("limpa descrições com muitas linhas vazias", () => {
    expect(normalizeEvent(messyDescriptionEvent)).toMatchObject({
      startDate: "2027-07-30",
      startTime: "21:00",
      endDate: "2027-07-31",
      description:
        "Mais Novos • M/12\n\nDescrição\n\nLuís Vaz de Camões, já ouviram falar?",
    });
  });
});

// Casos SINTÉTICOS (inventados de propósito): a API não os traz de forma fiável.
describe("normalizeEvent (casos sintéticos)", () => {
  it("fim anterior ao início → evento de um só dia", () => {
    const event = normalizeEvent({
      ...minimalEvent,
      starts_at: "2026-05-10T00:00:00",
      ends_at: "2026-05-01T00:00:00",
    });
    expect(event?.endDate).toBe("2026-05-10");
  });

  it("data de início inválida → evento descartado (null)", () => {
    expect(normalizeEvent({ ...minimalEvent, starts_at: "amanhã" })).toBeNull();
  });

  it("título vazio depois de limpo → null", () => {
    expect(normalizeEvent({ ...minimalEvent, title: "   " })).toBeNull();
  });

  it("preço negativo e coordenadas impossíveis são ignorados", () => {
    const event = normalizeEvent({
      ...minimalEvent,
      price_min: -5,
      lat: 200,
      lon: 10,
    });
    expect(event?.priceMin).toBeNull();
    expect(event?.coordinates).toBeNull();
  });

  it("URLs que não são http(s) são ignorados", () => {
    const event = normalizeEvent({
      ...minimalEvent,
      url: "javascript:alert(1)",
      image_url: "data:text/html,x",
    });
    expect(event?.sourceUrl).toBeNull();
    expect(event?.imageUrl).toBeNull();
  });

  it("sold_out aceita número ou booleano", () => {
    expect(normalizeEvent({ ...minimalEvent, sold_out: 1 })?.soldOut).toBe(true);
    expect(normalizeEvent({ ...minimalEvent, sold_out: true })?.soldOut).toBe(true);
    expect(normalizeEvent({ ...minimalEvent, sold_out: 0 })?.soldOut).toBe(false);
  });
});