import { describe, expect, it } from "vitest";
import { makeEvent } from "./__fixtures__/eventBuilder";
import {
  computeFacets,
  DEFAULT_FILTERS,
  filterEvents,
  hasActiveFilters,
  sortEvents,
} from "./filters";

// Sexta-feira. O fim de semana é 28 e 29 de novembro.
const TODAY = "2026-11-27";

const ids = (events: Array<{ id: string }>) => events.map((event) => event.id);
const filters = (patch: Partial<typeof DEFAULT_FILTERS>) => ({ ...DEFAULT_FILTERS, ...patch });

const past = makeEvent({ id: "past", startDate: "2026-10-01", endDate: "2026-10-31" });
const ongoing = makeEvent({ id: "ongoing", startDate: "2023-04-18", endDate: "2027-12-31", relevanceScore: 1 });
const today = makeEvent({ id: "today", startDate: TODAY, endDate: TODAY, relevanceScore: 5 });
const saturday = makeEvent({ id: "sat", startDate: "2026-11-28", endDate: "2026-11-28", relevanceScore: 3 });
const in6days = makeEvent({ id: "in6", startDate: "2026-12-03", endDate: "2026-12-03" });
const in7days = makeEvent({ id: "in7", startDate: "2026-12-04", endDate: "2026-12-04" });
const all = [past, ongoing, today, saturday, in6days, in7days];

describe("filterEvents — quando", () => {
  it("'proximos' (por defeito) esconde o que já terminou e mantém o que está em cartaz", () => {
    expect(ids(filterEvents(all, DEFAULT_FILTERS, TODAY))).toEqual(["ongoing", "today", "sat", "in6", "in7"]);
  });

  it("'todos' inclui eventos passados", () => {
    expect(ids(filterEvents(all, filters({ when: "todos" }), TODAY))).toHaveLength(6);
  });

  it("'hoje' inclui o que decorre hoje (mesmo exposições longas) mas não o futuro", () => {
    expect(ids(filterEvents(all, filters({ when: "hoje" }), TODAY))).toEqual(["ongoing", "today"]);
  });

  it("'fim-de-semana' apanha sábado e domingo", () => {
    expect(ids(filterEvents(all, filters({ when: "fim-de-semana" }), TODAY))).toEqual(["ongoing", "sat"]);
  });

  it("'7-dias' inclui hoje+6 e exclui hoje+7", () => {
    const result = ids(filterEvents(all, filters({ when: "7-dias" }), TODAY));
    expect(result).toContain("in6");
    expect(result).toEqual(["ongoing", "today", "sat", "in6"]);
  });
});

describe("filterEvents — restantes filtros", () => {
  const porto = makeEvent({ id: "porto", distrito: "Porto", genre: "fado", priceMin: 0, title: "Noite de Fado" });
  const lisboa = makeEvent({ id: "lisboa", distrito: "Lisboa", genre: "teatro", priceMin: 15, title: "Exposição Aberta" });
  const unknownPrice = makeEvent({ id: "sem-preco", distrito: "Lisboa", genre: "fado" });
  const events = [porto, lisboa, unknownPrice];

  it("distrito e género", () => {
    expect(ids(filterEvents(events, filters({ distrito: "Lisboa" }), TODAY))).toEqual(["lisboa", "sem-preco"]);
    expect(ids(filterEvents(events, filters({ genre: "fado" }), TODAY))).toEqual(["porto", "sem-preco"]);
  });

  it("entrada livre só aceita preço 0 (preço desconhecido não conta como grátis)", () => {
    expect(ids(filterEvents(events, filters({ freeOnly: true }), TODAY))).toEqual(["porto"]);
  });

  it("a pesquisa ignora acentos e maiúsculas", () => {
    expect(ids(filterEvents(events, filters({ q: "EXPOSIÇÃO" }), TODAY))).toEqual(["lisboa"]);
    expect(ids(filterEvents(events, filters({ q: "exposicao" }), TODAY))).toEqual(["lisboa"]);
  });

  it("várias palavras têm de existir todas (E, em qualquer ordem)", () => {
    expect(ids(filterEvents(events, filters({ q: "fado noite" }), TODAY))).toEqual(["porto"]);
    expect(ids(filterEvents(events, filters({ q: "fado lisboa" }), TODAY))).toEqual(["sem-preco"]);
  });

  it("filtros combinados", () => {
    expect(ids(filterEvents(events, filters({ distrito: "Lisboa", genre: "fado" }), TODAY))).toEqual(["sem-preco"]);
  });
});

describe("sortEvents", () => {
  it("'relevancia': maior primeiro; empate resolvido pela data mais próxima", () => {
    const a = makeEvent({ id: "a", relevanceScore: 2, startDate: "2026-12-10", endDate: "2026-12-10" });
    const b = makeEvent({ id: "b", relevanceScore: 2, startDate: "2026-12-05", endDate: "2026-12-05" });
    const c = makeEvent({ id: "c", relevanceScore: 9 });
    expect(ids(sortEvents([a, b, c], "relevancia", TODAY))).toEqual(["c", "b", "a"]);
  });

  it("'data': o que está em cartaz conta como hoje, não como 2023", () => {
    const sorted = sortEvents([in6days, today, ongoing, saturday], "data", TODAY);
    // ongoing e today começam "hoje"; entre eles decide a relevância (5 > 1).
    expect(ids(sorted)).toEqual(["today", "ongoing", "sat", "in6"]);
  });

  it("'recentes': mais recente primeiro, sem data de deteção no fim", () => {
    const old = makeEvent({ id: "old", firstSeenAt: "2026-01-01T10:00:00+00:00" });
    const fresh = makeEvent({ id: "fresh", firstSeenAt: "2026-11-26T10:00:00+00:00" });
    const unknown = makeEvent({ id: "unknown", firstSeenAt: null });
    expect(ids(sortEvents([unknown, old, fresh], "recentes", TODAY))).toEqual(["fresh", "old", "unknown"]);
  });

  it("não altera o array original", () => {
    const input = [in6days, today];
    sortEvents(input, "relevancia", TODAY);
    expect(ids(input)).toEqual(["in6", "today"]);
  });
});

describe("computeFacets", () => {
  const events = [
    makeEvent({ id: "1", distrito: "Porto", genre: "fado" }),
    makeEvent({ id: "2", distrito: "Porto", genre: "teatro" }),
    makeEvent({ id: "3", distrito: "Lisboa", genre: "fado" }),
    makeEvent({ id: "4", distrito: null, genre: "fado" }),
  ];

  it("conta cada opção sem aplicar o próprio filtro", () => {
    const facets = computeFacets(events, filters({ distrito: "Porto" }), TODAY);
    // Os distritos contam como se nenhum estivesse escolhido…
    expect(facets.distritos).toEqual([
      { value: "Lisboa", count: 1 },
      { value: "Porto", count: 2 },
    ]);
    // …mas os géneros respeitam o distrito escolhido.
    expect(facets.genres).toEqual([
      { value: "fado", count: 1 },
      { value: "teatro", count: 1 },
    ]);
  });

  it("os géneros vêm ordenados do mais para o menos frequente", () => {
    const facets = computeFacets(events, DEFAULT_FILTERS, TODAY);
    expect(facets.genres[0]).toEqual({ value: "fado", count: 3 });
  });

  it("uma opção escolhida sem resultados continua na lista, com 0", () => {
    const facets = computeFacets(events, filters({ distrito: "Faro" }), TODAY);
    expect(facets.distritos).toContain({ value: "Faro", count: 0 });
  });
});

describe("hasActiveFilters", () => {
  it("defaults e ordenação não contam", () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(hasActiveFilters(filters({ sort: "data", page: 3 }))).toBe(false);
  });

  it("qualquer filtro conta", () => {
    expect(hasActiveFilters(filters({ q: "x" }))).toBe(true);
    expect(hasActiveFilters(filters({ distrito: "Porto" }))).toBe(true);
    expect(hasActiveFilters(filters({ genre: "fado" }))).toBe(true);
    expect(hasActiveFilters(filters({ freeOnly: true }))).toBe(true);
    expect(hasActiveFilters(filters({ when: "hoje" }))).toBe(true);
  });
});
