import { toLisbonDateTime } from './dates';

/** Operações sobre dias "YYYY-MM-DD", feitas em UTC para o fuso do browser não interferir. */

export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** 0 = domingo … 6 = sábado. */
export function weekdayOf(day: string): number {
  return new Date(`${day}T00:00:00Z`).getUTCDay();
}

/** O dia de hoje em Lisboa. `now` é injetável para os testes serem determinísticos. */
export function todayInLisbon(now: Date = new Date()): string {
  const lisbon = toLisbonDateTime(now.toISOString());
  return lisbon ? lisbon.date : now.toISOString().slice(0, 10);
}

/**
 * O fim de semana "mais próximo": de segunda a sexta é o que vem; ao sábado
 * e ao domingo é o que está a decorrer (a começar hoje).
 */
export function weekendRange(today: string): [string, string] {
  const weekday = weekdayOf(today);
  if (weekday === 0) return [today, today];
  if (weekday === 6) return [today, addDays(today, 1)];
  const saturday = addDays(today, 6 - weekday);
  return [saturday, addDays(saturday, 1)];
}
