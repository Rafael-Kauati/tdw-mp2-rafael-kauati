import { describe, expect, it } from "vitest";
import { genreLabel } from "./genres";

describe("genreLabel", () => {
  it("devolve a etiqueta com acentos para géneros conhecidos", () => {
    expect(genreLabel("musica-classica")).toBe("Música clássica");
    expect(genreLabel("rock-pop")).toBe("Rock / Pop");
  });

  it("faz fallback legível para géneros desconhecidos", () => {
    expect(genreLabel("stand-up")).toBe("Stand up");
  });

  it("usa 'Outro' para texto vazio", () => {
    expect(genreLabel("")).toBe("Outro");
  });
});