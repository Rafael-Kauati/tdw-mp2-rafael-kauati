import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { InvalidFeedError, parseEventsFeed } from "../domain/";
import { rawFeed } from "./__fixtures__/rawFeed";
import type { EventsRepository } from "./eventsRepository";
import { eventsFeedQueryOptions, findEventById } from "./queries";

const feed = parseEventsFeed(rawFeed);

describe("eventsFeedQueryOptions", () => {
  it("vai buscar o feed ao repositório e reutiliza a cache", async () => {
    const repository: EventsRepository = { getFeed: vi.fn().mockResolvedValue(feed) };
    const client = new QueryClient();

    const first = await client.fetchQuery(eventsFeedQueryOptions(repository));
    const second = await client.fetchQuery(eventsFeedQueryOptions(repository));

    expect(first).toBe(feed);
    expect(second).toBe(feed);
    expect(repository.getFeed).toHaveBeenCalledTimes(1); // 2.ª chamada veio da cache
  });

  it("propaga o erro do repositório", async () => {
    const repository: EventsRepository = {
      getFeed: vi.fn().mockRejectedValue(new InvalidFeedError("x")),
    };
    const client = new QueryClient();

    await expect(client.fetchQuery(eventsFeedQueryOptions(repository))).rejects.toBeInstanceOf(
      InvalidFeedError,
    );
  });
});

describe("findEventById", () => {
  it("encontra um evento existente", () => {
    expect(findEventById(feed, "fever-pena-001")?.title).toBe("Palácio da Pena: Visita Guiada");
  });

  it("devolve null para id desconhecido ou em falta", () => {
    expect(findEventById(feed, "nao-existe")).toBeNull();
    expect(findEventById(feed, undefined)).toBeNull();
  });
});
