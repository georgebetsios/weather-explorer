import type { CurrentSnapshot, ForecastResponse, Place } from '../types/weather';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  // fetch doesn't throw on HTTP errors (404, 429...), so we have to check it ourselves
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Round to 2 decimals so that clicks close to each other
// end up with the same URL and cache key.
export function roundCoord(value: number): number {
  return Math.round(value * 100) / 100;
}

export function fetchForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(roundCoord(latitude)),
    longitude: String(roundCoord(longitude)),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    hourly: ['temperature_2m', 'precipitation_probability', 'weather_code', 'is_day'].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto', // return times in the local time of the place
    forecast_days: '7',
  });

  return getJson<ForecastResponse>(`${FORECAST_URL}?${params}`);
}

// Greek and Greek Extended Unicode ranges
const GREEK_CHARACTERS = /[\u0370-\u03FF\u1F00-\u1FFF]/;

// The geocoding API matches names in the requested language,
// so Greek input has to be searched with language=el
function detectLanguage(text: string): string {
  return GREEK_CHARACTERS.test(text) ? 'el' : 'en';
}

interface GeocodingResponse {
  // "results" is missing completely when nothing is found
  results?: {
    id: number;
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }[];
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: detectLanguage(query),
    format: 'json',
  });

  const data = await getJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`);

  // Map the API response to our own Place type
  return (data.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

interface CurrentOnlyResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

// Gets the current weather for many places in ONE request
// Returns an object keyed by place id instead of an array, so a place can never
// get another place's data while the list is changing.
export async function fetchCurrentForPlaces(
  places: Place[],
): Promise<Record<string, CurrentSnapshot>> {
  if (places.length === 0) return {};

  const params = new URLSearchParams({
    latitude: places.map((place) => roundCoord(place.latitude)).join(','),
    longitude: places.map((place) => roundCoord(place.longitude)).join(','),
    current: 'temperature_2m,weather_code,is_day',
  });

  const data = await getJson<CurrentOnlyResponse | CurrentOnlyResponse[]>(
    `${FORECAST_URL}?${params}`,
  );

  // The API returns a single object for one location and an array for more
  const list = Array.isArray(data) ? data : [data];

  // Results come back in the same order as the coordinates we sent
  const result: Record<string, CurrentSnapshot> = {};
  list.forEach((item, index) => {
    result[places[index].id] = {
      temperature: item.current.temperature_2m,
      weatherCode: item.current.weather_code,
      isDay: item.current.is_day === 1,
    };
  });
  return result;
}
