import { describe, expect, it } from "vitest";
import { toLisbonDateTime } from "./dates";

describe("toLisbonDateTime", () => {
  it("mantém datas sem fuso como hora local", () => {
    expect(toLisbonDateTime("2026-01-01T00:00:00")).toEqual({
      date: "2026-01-01",
      time: "00:00",
    });
  });

  it("aceita só o dia", () => {
    expect(toLisbonDateTime("2026-01-01")).toEqual({
      date: "2026-01-01",
      time: "00:00",
    });
  });

  it("converte offsets para hora de Lisboa", () => {
    expect(toLisbonDateTime("2026-03-05T00:00:00+00:00")).toEqual({
      date: "2026-03-05",
      time: "00:00",
    });
    expect(toLisbonDateTime("2027-07-31T00:00:00+01:00")).toEqual({
      date: "2027-07-31",
      time: "00:00",
    });
  });

  it("passa para o dia seguinte quando o horário de verão o exige", () => {
    // 23:30 UTC em junho = 00:30 do dia seguinte em Lisboa (UTC+1).
    expect(toLisbonDateTime("2026-06-30T23:30:00+00:00")).toEqual({
      date: "2026-07-01",
      time: "00:30",
    });
  });

  it("devolve null para datas impossíveis ou texto inválido", () => {
    expect(toLisbonDateTime("2026-02-30T10:00:00")).toBeNull();
    expect(toLisbonDateTime("amanhã")).toBeNull();
  });
});