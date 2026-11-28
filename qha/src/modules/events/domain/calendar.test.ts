import { describe, expect, it } from "vitest";
import { addDays, todayInLisbon, weekdayOf, weekendRange } from "./calendar";

describe("addDays", () => {
  it("passa o fim do mês e do ano", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("aceita valores negativos", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("weekdayOf", () => {
  it("0 = domingo … 6 = sábado", () => {
    expect(weekdayOf("2026-11-29")).toBe(0); // domingo
    expect(weekdayOf("2026-11-27")).toBe(5); // sexta-feira
    expect(weekdayOf("2026-11-28")).toBe(6); // sábado
  });
});

describe("weekendRange", () => {
  it("de segunda a sexta é o fim de semana que vem", () => {
    expect(weekendRange("2026-11-23")).toEqual(["2026-11-28", "2026-11-29"]); // segunda
    expect(weekendRange("2026-11-27")).toEqual(["2026-11-28", "2026-11-29"]); // sexta
  });

  it("ao sábado começa hoje e acaba domingo", () => {
    expect(weekendRange("2026-11-28")).toEqual(["2026-11-28", "2026-11-29"]);
  });

  it("ao domingo resta só hoje", () => {
    expect(weekendRange("2026-11-29")).toEqual(["2026-11-29", "2026-11-29"]);
  });
});

describe("todayInLisbon", () => {
  it("usa o dia de Lisboa, não o de UTC (verão: 23:30 UTC já é dia seguinte)", () => {
    expect(todayInLisbon(new Date("2026-06-30T23:30:00Z"))).toBe("2026-07-01");
  });

  it("no inverno Lisboa coincide com UTC", () => {
    expect(todayInLisbon(new Date("2026-12-15T23:30:00Z"))).toBe("2026-12-15");
  });
});
