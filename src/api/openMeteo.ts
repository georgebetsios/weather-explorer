import type { CurrentSnapshot, ForecastResponse, Place } from '../types/weather';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Γενική συνάρτηση για GET requests που επιστρέφουν JSON.
// Το <T> είναι "generic": όποιος την καλεί λέει τι τύπο περιμένει πίσω.
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Στρογγυλεύουμε στα 2 δεκαδικά (~1 km ακρίβεια).
// Έτσι, δύο κλικ σχεδόν στο ίδιο σημείο δίνουν το ίδιο URL και το cache πιάνει.
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
    timezone: 'auto',     // οι ώρες έρχονται στην τοπική ώρα του μέρους
    forecast_days: '7',
  });

  return getJson<ForecastResponse>(`${FORECAST_URL}?${params}`);
}

// Το σχήμα της απάντησης του Geocoding API (μόνο τα πεδία που χρειαζόμαστε)
interface GeocodingResponse {
  results?: {          // αν δεν βρει τίποτα, το "results" λείπει εντελώς!
    id: number;
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }[];
}

// Ελληνικοί χαρακτήρες: βασικό ελληνικό αλφάβητο + πολυτονικό
const GREEK_CHARACTERS = /[\u0370-\u03FF\u1F00-\u1FFF]/;

function detectLanguage(text: string): string {
  return GREEK_CHARACTERS.test(text) ? 'el' : 'en';
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: detectLanguage(query),
    format: 'json',
  });

  const data = await getJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`);

  // Μετατρέπουμε το σχήμα του API στο δικό μας σχήμα (Place)
  return (data.results ?? []).map((r) => ({
    id: String(r.id),
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

interface CurrentOnlyResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

// Φέρνει τον τρέχοντα καιρό για ΠΟΛΛΑ μέρη με ΕΝΑ request.
// Επιστρέφει αντικείμενο: { [place.id]: CurrentSnapshot }
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

  // Με 1 τοποθεσία το API επιστρέφει αντικείμενο, με πολλές επιστρέφει πίνακα
  const list = Array.isArray(data) ? data : [data];

  // Τα αποτελέσματα έρχονται με την ίδια σειρά που στείλαμε τα μέρη
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