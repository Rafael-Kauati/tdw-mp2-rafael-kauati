const FALLBACK = '/eventos';

/** Estado enviado ao navegar da lista para o detalhe: de onde veio (com filtros e página). */
export interface BackToState {
  backTo: string;
}

/**
 * Lê o destino do "voltar" a partir do estado da navegação. Se o detalhe foi aberto
 * diretamente (link partilhado, novo separador), não há estado e volta-se à lista simples.
 * Só aceita caminhos de /eventos: o estado vem do histórico e não se confia cegamente nele.
 */
export function readBackTo(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'backTo' in state) {
    const value = (state as { backTo: unknown }).backTo;
    if (typeof value === 'string' && /^\/eventos(?:[?/]|$)/.test(value)) return value;
  }
  return FALLBACK;
}
