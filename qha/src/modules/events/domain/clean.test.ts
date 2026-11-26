import { describe, expect, it } from "vitest";
import {
  cleanDescription,
  cleanTitle,
  foldForSearch,
  toHttpUrl,
  trimOrNull,
} from "./clean";

describe("cleanTitle", () => {
  it("converte Unicode 'a negrito' e junta acentos soltos", () => {
    expect(
      cleanTitle("𝗘𝘅𝗽𝗼𝘀𝗶𝗰̧𝗮̃𝗼 𝗱𝗲 𝗙𝗼𝘁𝗼𝗴𝗿𝗮𝗳𝗶𝗮 | 𝗥𝗼𝗺𝗮𝗿𝗶𝗮 𝗖𝗶𝗴𝗮𝗻𝗮"),
    ).toBe("Exposição de Fotografia | Romaria Cigana");
  });

  it("colapsa espaços e quebras de linha", () => {
    expect(cleanTitle("  Fado   ao \n Vivo ")).toBe("Fado ao Vivo");
  });
});

describe("cleanDescription", () => {
  it("remove o lixo conhecido da fonte", () => {
    expect(
      cleanDescription(
        "Bilhetes BlackFriday2026\n.hidden-word { display: none; }\nFim",
      ),
    ).toBe("Bilhetes\n\nFim");
  });

  it("colapsa linhas vazias consecutivas", () => {
    expect(
      cleanDescription("Mais Novos • M/12\n  \n\n\n\n\nDescrição\n\n\n\nLuís"),
    ).toBe("Mais Novos • M/12\n\nDescrição\n\nLuís");
  });

  it("devolve null para lorem ipsum, vazio ou em falta", () => {
    expect(cleanDescription("Lorem ipsum dolor sit amet")).toBeNull();
    expect(cleanDescription("   ")).toBeNull();
    expect(cleanDescription(undefined)).toBeNull();
    expect(cleanDescription(null)).toBeNull();
  });
});

describe("foldForSearch", () => {
  it("remove acentos e passa a minúsculas", () => {
    expect(foldForSearch("Exposição Açoriana")).toBe("exposicao acoriana");
  });
});

describe("toHttpUrl", () => {
  it("aceita http(s)", () => {
    expect(toHttpUrl("https://feverup.com/m/117180")).toBe(
      "https://feverup.com/m/117180",
    );
  });

  it("rejeita outros protocolos e valores inválidos", () => {
    expect(toHttpUrl("javascript:alert(1)")).toBeNull();
    expect(toHttpUrl("not a url")).toBeNull();
    expect(toHttpUrl(null)).toBeNull();
  });
});

describe("trimOrNull", () => {
  it("apara ou devolve null", () => {
    expect(trimOrNull("  x ")).toBe("x");
    expect(trimOrNull("  ")).toBeNull();
    expect(trimOrNull(undefined)).toBeNull();
  });
});