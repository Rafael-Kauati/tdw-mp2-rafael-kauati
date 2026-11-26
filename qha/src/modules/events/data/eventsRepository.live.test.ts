import { describe, expect, it } from "vitest";
import { createHttpEventsRepository } from "./eventsRepository";

// Só corre com VITE_LIVE=1, para a CI não depender da rede.
// Corre em Node: NÃO valida CORS (isso só se vê no browser).
describe.skipIf(!import.meta.env.VITE_LIVE)("repositório contra a API real", () => {
  const repository = createHttpEventsRepository("https://www.nocartaz.pt/events.json");

  it("devolve o feed completo através do repositório", async () => {
    const feed = await repository.getFeed();

    expect(feed.events.length).toBeGreaterThan(1000);
    expect(feed.skippedCount).toBeLessThan(feed.events.length * 0.01);
    expect(feed.stats).not.toBeNull();
  }, 30_000);

  it("cancela o pedido quando o AbortSignal é acionado", async () => {
    const controller = new AbortController();
    const pending = repository.getFeed(controller.signal);
    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});