import { describe, expect, it } from "vitest";
import { parseEventsFeed } from "./feed";

// Só corre com VITE_LIVE=1, para a CI não depender da rede.
describe.skipIf(!import.meta.env.VITE_LIVE)("feed real do nocartaz", () => {
  it("interpreta o ficheiro completo", async () => {
    const json = await fetch("https://www.nocartaz.pt/events.json").then((r) => r.json());
    const feed = parseEventsFeed(json);

    const genres = Array.from(new Set(feed.events.map((e) => e.genre)));
    console.log({
      recebidos: json.events.length,
      validos: feed.events.length,
      descartados: feed.skippedCount,
      semStats: feed.stats === null,
      generos: genres,
    });

    expect(feed.events.length).toBeGreaterThan(0);
  }, 30_000);
});