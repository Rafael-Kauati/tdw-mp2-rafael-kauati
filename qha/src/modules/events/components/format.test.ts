import { describe, expect, it } from "vitest";
import { formatEventDates, formatPrice } from "./format";

describe("formatEventDates", () => {
  it("um só dia mostra o dia da semana e a hora", () => {
    expect(formatEventDates("2026-11-17", "2026-11-17", "09:30")).toBe(
      "terça-feira, 17 de novembro de 2026, 09:30",
    );
  });

  it("um só dia sem hora conhecida não inventa hora", () => {
    expect(formatEventDates("2026-11-17", "2026-11-17", null)).toBe(
      "terça-feira, 17 de novembro de 2026",
    );
  });

  it("vários dias mostra o intervalo", () => {
    expect(formatEventDates("2026-11-17", "2027-02-13", "09:30")).toBe(
      "17 de novembro de 2026 a 13 de fevereiro de 2027",
    );
  });
});

describe("formatPrice", () => {
  it("preço desconhecido → null", () => {
    expect(formatPrice(null)).toBeNull();
  });

  it("zero → entrada livre", () => {
    expect(formatPrice(0)).toBe("Entrada livre");
  });

  it("preço positivo → 'desde' com euros", () => {
    const text = formatPrice(18);
    expect(text).toContain("desde");
    expect(text).toContain("18");
    expect(text).toContain("€");
  });
});
