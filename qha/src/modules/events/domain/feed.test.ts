import { describe, expect, it } from "vitest";
import { InvalidFeedError, parseEventsFeed } from "./feed";
import { minimalEvent, rawEvents, rawFeed } from "./__fixtures__/rawFeed";

describe("parseEventsFeed", () => {
  it("interpreta o ficheiro completo", () => {
    const feed = parseEventsFeed(rawFeed);

    expect(feed.events).toHaveLength(rawEvents.length);
    expect(feed.skippedCount).toBe(0);
    expect(feed.generatedAt).toBe("2026-11-25T08:00:00+00:00");
    expect(feed.stats).toMatchObject({
      totalEvents: 6,
      totalVenuesInCatalog: 120,
      byDistrito: { Lisboa: { events: 3, venues: 2, concelhos: 2 } },
    });
  });

  // Casos SINTÉTICOS (inventados de propósito).
  it("descarta eventos malformados e duplicados e conta-os", () => {
    const feed = parseEventsFeed({
      ...rawFeed,
      events: [
        ...rawEvents,
        { id: "sem-titulo" }, // falha o schema
        { ...minimalEvent, starts_at: "data inválida", id: "data-ma" }, // falha a normalização
        { ...minimalEvent }, // id duplicado
      ],
    });

    expect(feed.events).toHaveLength(rawEvents.length);
    expect(feed.skippedCount).toBe(3);
  });

  it("estatísticas inválidas não impedem a leitura dos eventos", () => {
    const feed = parseEventsFeed({ ...rawFeed, stats: { total_events: "muitos" } });
    expect(feed.stats).toBeNull();
    expect(feed.events).toHaveLength(rawEvents.length);
  });

  it("lança InvalidFeedError quando o formato geral está errado", () => {
    expect(() => parseEventsFeed(null)).toThrow(InvalidFeedError);
    expect(() => parseEventsFeed({})).toThrow(InvalidFeedError);
    expect(() => parseEventsFeed({ events: "nope" })).toThrow(InvalidFeedError);
  });

  it("lança erro (e não devolve lista vazia) quando nenhum evento é utilizável", () => {
    const call = () => parseEventsFeed({ events: [{ foo: 1 }, { bar: 2 }] });
    expect(call).toThrow(InvalidFeedError);
    // A mensagem garante que falhou pelo motivo certo (e não no schema do ficheiro).
    expect(call).toThrow(/Nenhum evento/);
  });

  it("uma lista vazia legítima é aceite (mesmo sem stats)", () => {
    const feed = parseEventsFeed({ events: [] });
    expect(feed.events).toEqual([]);
    expect(feed.stats).toBeNull();
  });
});