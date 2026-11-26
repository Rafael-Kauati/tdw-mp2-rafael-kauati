/**
 * A API mistura datas com offset ("...+01:00") e sem offset ("2026-01-01T00:00:00").
 * Regra do domínio: tudo é convertido para o dia/hora em Europe/Lisbon, e as
 * datas sem offset já são consideradas hora de Lisboa. Assim o resultado não
 * depende do fuso horário do browser de quem está a ver.
 */

export interface LisbonDateTime {
    /** YYYY-MM-DD */
    date: string;
    /** HH:mm */
    time: string;
  }
  
  const WALL_CLOCK = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?)?$/;
  
  const lisbonFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  
  function isRealCalendarDate(date: string): boolean {
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
  }
  
  /** Devolve null se o texto não for uma data válida. */
  export function toLisbonDateTime(value: string): LisbonDateTime | null {
    const text = value.trim();
  
    // Sem offset: já é hora de Lisboa, não há nada a converter.
    const wallClock = WALL_CLOCK.exec(text);
    if (wallClock) {
      const date = wallClock[1];
      if (!isRealCalendarDate(date)) return null;
      return { date, time: wallClock[2] ?? '00:00' };
    }
  
    // Com offset (ou "Z"): é um instante; convertemos para Lisboa.
    const instant = new Date(text);
    if (Number.isNaN(instant.getTime())) return null;
  
    const parts: Record<string, string> = {};
    for (const part of lisbonFormat.formatToParts(instant)) {
      parts[part.type] = part.value;
    }
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      time: `${parts.hour}:${parts.minute}`,
    };
  }