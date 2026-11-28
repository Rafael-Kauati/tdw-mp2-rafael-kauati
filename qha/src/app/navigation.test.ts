import { describe, expect, it } from "vitest";
import { readBackTo } from "./navigation";

describe("readBackTo", () => {
  it("devolve o caminho guardado, com filtros", () => {
    expect(readBackTo({ backTo: "/eventos?distrito=Porto&pagina=2" })).toBe("/eventos?distrito=Porto&pagina=2");
    expect(readBackTo({ backTo: "/eventos" })).toBe("/eventos");
  });

  it("sem estado (link direto) volta à lista", () => {
    expect(readBackTo(null)).toBe("/eventos");
    expect(readBackTo(undefined)).toBe("/eventos");
    expect(readBackTo({})).toBe("/eventos");
  });

  it("recusa destinos que não são de /eventos", () => {
    expect(readBackTo({ backTo: "https://evil.example" })).toBe("/eventos");
    expect(readBackTo({ backTo: "//evil.example" })).toBe("/eventos");
    expect(readBackTo({ backTo: "/eventosx" })).toBe("/eventos");
    expect(readBackTo({ backTo: 42 })).toBe("/eventos");
  });
});
