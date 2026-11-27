/**
 * Géneros observados no ficheiro real (19 em novembro de 2026).
 * Os desconhecidos continuam a funcionar através do fallback em genreLabel().
 */
const GENRE_LABELS: Record<string, string> = {
  outro: 'Outro',
  exposicao: 'Exposição',
  'artes-visuais': 'Artes visuais',
  teatro: 'Teatro',
  danca: 'Dança',
  cinema: 'Cinema',
  infantil: 'Infantil',
  literatura: 'Literatura',
  conferencia: 'Conferência',
  performance: 'Performance',
  festival: 'Festival',
  fado: 'Fado',
  folk: 'Folk',
  'rock-pop': 'Rock / Pop',
  indie: 'Indie',
  jazz: 'Jazz',
  eletronica: 'Eletrónica',
  'musica-classica': 'Música clássica',
  opera: 'Ópera',
};

/** Etiqueta legível; para géneros desconhecidos, faz fallback a partir do slug. */
export function genreLabel(genre: string): string {
  const known = GENRE_LABELS[genre];
  if (known) return known;
  const text = genre.replace(/-/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : GENRE_LABELS.outro;
}