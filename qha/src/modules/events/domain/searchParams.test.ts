import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS } from "./filters";
import { applyFilterPatch, parseFilters, serializeFilters } from "./searchParams";

const parse = (query: string) => parseFilters(new URLSearchParams(query));

describe("parseFilters", () => {
  it("URL vazio → valores por defeito", () => {
    expect(parse("")).toEqual(DEFAULT_FILTERS);
  });

  it("lê todos os parâmetros", () => {
    expect(
      parse("q=fado&distrito=Porto&genero=fado&quando=fim-de-semana&gratis=1&ordem=data&pagina=3"),
    ).toEqual({
      q: "fado",
      distrito: "Porto",
      genre: "fado",
      when: "fim-de-semana",
      freeOnly: true,
      sort: "data",
      page: 3,
    });
  });

  it("valores inválidos caem no valor por defeito (o URL pode ser editado à mão)", () => {
    const filters = parse("quando=ontem&ordem=aleatorio&gratis=talvez&pagina=abc");
    expect(filters.when).toBe(DEFAULT_FILTERS.when);
    expect(filters.sort).toBe(DEFAULT_FILTERS.sort);
    expect(filters.freeOnly).toBe(false);
    expect(filters.page).toBe(1);
  });

  it("página tem de ser um inteiro ≥ 1", () => {
    expect(parse("pagina=0").page).toBe(1);
    expect(parse("pagina=-3").page).toBe(1);
    expect(parse("pagina=2.5").page).toBe(1);
    expect(parse("pagina=").page).toBe(1);
    expect(parse("pagina=7").page).toBe(7);
  });

  it("a pesquisa é aparada e limitada a 100 caracteres", () => {
    expect(parse("q=%20%20fado%20%20").q).toBe("fado");
    expect(parse(`q=${"a".repeat(300)}`).q).toHaveLength(100);
  });

  it("distrito e género vazios contam como ausentes", () => {
    expect(parse("distrito=&genero=%20").distrito).toBeNull();
    expect(parse("distrito=&genero=%20").genre).toBeNull();
  });
});

describe("serializeFilters", () => {
  it("os valores por defeito não aparecem no URL", () => {
    expect(serializeFilters(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("só escreve o que foi alterado, por ordem estável", () => {
    const params = serializeFilters({ ...DEFAULT_FILTERS, q: "fado", distrito: "Porto", page: 2 });
    expect(params.toString()).toBe("q=fado&distrito=Porto&pagina=2");
  });

  it("ida e volta: parse(serialize(x)) devolve x", () => {
    const original = {
      q: "exposição de arte",
      distrito: "Viana do Castelo",
      genre: "artes-visuais",
      when: "7-dias" as const,
      freeOnly: true,
      sort: "recentes" as const,
      page: 4,
    };
    expect(parseFilters(serializeFilters(original))).toEqual(original);
  });
});

describe("applyFilterPatch", () => {
  const current = { ...DEFAULT_FILTERS, q: "fado", page: 5 };

  it("mudar um filtro volta à página 1", () => {
    expect(applyFilterPatch(current, { distrito: "Porto" })).toMatchObject({ q: "fado", distrito: "Porto", page: 1 });
  });

  it("mudar só a página mantém o resto", () => {
    expect(applyFilterPatch(current, { page: 6 })).toMatchObject({ q: "fado", page: 6 });
  });
});
