import type { DayPoint, ForecastResponse, HourPoint } from '../types/weather';

// We don't use new Date() here because that gives the user's time, not the place's.
// All API times are already in the place's local time (timezone=auto).
export function getUpcomingHours(forecast: ForecastResponse, count = 24): HourPoint[] {
  const { hourly, current } = forecast;

  // "2026-11-19T18:15" -> "2026-11-19T18"
  const currentHour = current.time.slice(0, 13);

  // ISO date strings can be compared as plain strings
  const startIndex = hourly.time.findIndex((time) => time.slice(0, 13) >= currentHour);
  if (startIndex === -1) return [];

  return hourly.time.slice(startIndex, startIndex + count).map((time, offset) => {
    const i = startIndex + offset;
    return {
      time,
      temperature: hourly.temperature_2m[i],
      precipitationProbability: hourly.precipitation_probability[i],
      weatherCode: hourly.weather_code[i],
      isDay: hourly.is_day[i] === 1,
    };
  });
}

// Turns the parallel daily arrays into one object per day
export function getDailyForecast(forecast: ForecastResponse): DayPoint[] {
  const { daily } = forecast;

  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    min: daily.temperature_2m_min[i],
    max: daily.temperature_2m_max[i],
    precipitationProbability: daily.precipitation_probability_max[i],
  }));
}
