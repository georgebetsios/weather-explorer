// "2026-11-19T18:00" -> "18:00"
export function formatHour(isoTime: string): string {
  return isoTime.slice(11, 16);
}

// We parse and format in UTC so the weekday never shifts because of the user's time zone.
const weekdayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  timeZone: 'UTC',
});

// "2026-11-19" -> "Thu"
export function formatWeekday(isoDate: string): string {
  return weekdayFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}
