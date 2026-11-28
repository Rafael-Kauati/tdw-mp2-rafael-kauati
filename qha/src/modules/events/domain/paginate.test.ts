import { describe, expect, it } from "vitest";
import { paginate } from "./paginate";

const items = Array.from({ length: 10 }, (_, index) => index + 1);

describe("paginate", () => {
  it("devolve a fatia certa e os totais", () => {
    expect(paginate(items, 2, 4)).toEqual({ items: [5, 6, 7, 8], page: 2, pageCount: 3, total: 10 });
  });

  it("a última página pode ter menos itens", () => {
    expect(paginate(items, 3, 4).items).toEqual([9, 10]);
  });

  it("página fora dos limites é corrigida para a mais próxima", () => {
    expect(paginate(items, 99, 4).page).toBe(3);
    expect(paginate(items, 0, 4).page).toBe(1);
    expect(paginate(items, -5, 4).page).toBe(1);
  });

  it("lista vazia tem 1 página (e não 0)", () => {
    expect(paginate([], 1, 4)).toEqual({ items: [], page: 1, pageCount: 1, total: 0 });
  });
});
