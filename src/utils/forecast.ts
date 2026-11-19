import type { DayPoint, ForecastResponse, HourPoint } from '../types/weather';

// Οι επόμενες `count` ώρες, ξεκινώντας από την τρέχουσα ώρα ΤΟΥ ΜΕΡΟΥΣ
export function getUpcomingHours(forecast: ForecastResponse, count = 24): HourPoint[] {
  const { hourly, current } = forecast;

  // current.time είναι π.χ. "2026-11-19T18:15" → κρατάμε "2026-11-19T18"
  const currentHour = current.time.slice(0, 13);

  // Το πρώτο index του hourly που είναι >= της τρέχουσας ώρας
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