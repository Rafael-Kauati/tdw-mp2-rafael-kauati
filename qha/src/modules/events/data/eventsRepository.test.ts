import { afterEach, describe, expect, it, vi } from "vitest";
import { InvalidFeedError } from "../domain";
import { rawEvents, rawFeed } from "./__fixtures__/rawFeed";
import { EventsHttpError, EventsNetworkError } from "./errors";
import { createHttpEventsRepository } from "./eventsRepository";

const repository = createHttpEventsRepository("https://example.test/events.json");

function stubFetch(impl: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createHttpEventsRepository", () => {
  it("lê e normaliza o ficheiro", async () => {
    stubFetch(async () => new Response(JSON.stringify(rawFeed), { status: 200 }));
    const feed = await repository.getFeed();
    expect(feed.events).toHaveLength(rawEvents.length);
  });

  it("estado HTTP de erro → EventsHttpError com o código", async () => {
    stubFetch(async () => new Response("erro", { status: 503 }));
    await expect(repository.getFeed()).rejects.toBeInstanceOf(EventsHttpError);
    await expect(repository.getFeed()).rejects.toMatchObject({ status: 503 });
  });

  it("falha de rede (TypeError) → EventsNetworkError", async () => {
    stubFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(repository.getFeed()).rejects.toBeInstanceOf(EventsNetworkError);
  });

  it("resposta que não é JSON → InvalidFeedError", async () => {
    stubFetch(async () => new Response("<html>", { status: 200 }));
    await expect(repository.getFeed()).rejects.toBeInstanceOf(InvalidFeedError);
  });

  it("um cancelamento (AbortError) não é tratado como erro de rede", async () => {
    stubFetch(async () => {
      throw new DOMException("Aborted", "AbortError");
    });
    await expect(repository.getFeed()).rejects.toMatchObject({ name: "AbortError" });
  });
});
