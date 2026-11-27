import { describe, expect, it } from "vitest";
import { InvalidFeedError } from "../domain";
import {
  describeEventsError,
  EventsHttpError,
  EventsNetworkError,
  isRetryableEventsError,
} from "./errors";

describe("isRetryableEventsError", () => {
  it("repete falhas de rede e erros 5xx/429", () => {
    expect(isRetryableEventsError(new EventsNetworkError())).toBe(true);
    expect(isRetryableEventsError(new EventsHttpError(503))).toBe(true);
    expect(isRetryableEventsError(new EventsHttpError(429))).toBe(true);
  });

  it("não repete 404, dados inválidos nem erros desconhecidos", () => {
    expect(isRetryableEventsError(new EventsHttpError(404))).toBe(false);
    expect(isRetryableEventsError(new InvalidFeedError("x"))).toBe(false);
    expect(isRetryableEventsError(new Error("?"))).toBe(false);
  });
});

describe("describeEventsError", () => {
  it("devolve uma mensagem própria para cada tipo de erro", () => {
    expect(describeEventsError(new EventsNetworkError()).title).toBe("Sem ligação ao servidor");
    expect(describeEventsError(new EventsHttpError(500)).description).toContain("500");
    expect(describeEventsError(new InvalidFeedError("x")).title).toBe("Dados inesperados");
    expect(describeEventsError(new Error("?")).title).toBe("Algo correu mal");
  });
});
