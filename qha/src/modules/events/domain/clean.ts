/** Funções puras de limpeza de texto e URLs. Sem dependências. */

const COMBINING_MARKS = /[\u0300-\u036f]/g;

/** Lixo conhecido que aparece nas descrições da API. Fácil de estender. */
const NOISE_PATTERNS: RegExp[] = [
  /\.hidden-word\s*\{[^}]*\}/g, // bloco CSS solto
  /#?BlackFriday\d{4}/gi, // hashtag promocional
];

const PLACEHOLDER_TEXT = /^lorem ipsum/i;

export function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * NFKC converte letras Unicode "a negrito" (𝗔) em letras normais e junta
 * acentos soltos (c + ̧ → ç). Só usamos em títulos: em descrições alteraria
 * símbolos legítimos (… → ..., ™ → TM).
 */
export function cleanTitle(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim();
}

/** Limpa a descrição; devolve null se ficar vazia ou for texto de enchimento. */
export function cleanDescription(value: string | null | undefined): string | null {
  if (!value) return null;

  let text = value.normalize('NFC').replace(/\r\n?/g, '\n');
  for (const pattern of NOISE_PATTERNS) {
    text = text.replace(pattern, '');
  }

  text = text
    .split('\n')
    .map((line) => line.replace(/[ \t\u00a0]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (text === '' || PLACEHOLDER_TEXT.test(text)) return null;
  return text;
}

/** Minúsculas e sem acentos: "Exposição" → "exposicao". */
export function foldForSearch(value: string): string {
  return value.normalize('NFKD').replace(COMBINING_MARKS, '').toLowerCase();
}

/**
 * Só aceita http/https. Protege contra `javascript:` e afins, porque estes
 * valores acabam em atributos href/src.
 */
export function toHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}