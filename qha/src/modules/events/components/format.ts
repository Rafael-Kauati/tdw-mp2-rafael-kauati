/** Formatação para apresentação (pt-PT). Funções puras, sem React. */

// As datas do domínio são dias "YYYY-MM-DD": formatamos em UTC para o fuso do browser não deslocar o dia.
const longDate = new Intl.DateTimeFormat('pt-PT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const longDateWithWeekday = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

function toUtcDate(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

/** Um dia: "terça-feira, 17 de novembro de 2026, 09:30". Vários dias: "… a …". */
export function formatEventDates(startDate: string, endDate: string, startTime: string | null): string {
  if (startDate === endDate) {
    const day = longDateWithWeekday.format(toUtcDate(startDate));
    return startTime ? `${day}, ${startTime}` : day;
  }
  return `${longDate.format(toUtcDate(startDate))} a ${longDate.format(toUtcDate(endDate))}`;
}

/** null = preço desconhecido (não se mostra nada). */
export function formatPrice(priceMin: number | null): string | null {
  if (priceMin === null) return null;
  if (priceMin === 0) return 'Entrada livre';
  return `desde ${euro.format(priceMin)}`;
}
