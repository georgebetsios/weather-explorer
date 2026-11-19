// Ένα μέρος στον κόσμο (από αναζήτηση, από κλικ στον χάρτη ή από GPS)
export interface Place {
  id: string;
  name: string;
  country?: string;   // το ? σημαίνει «προαιρετικό», μπορεί να λείπει
  admin1?: string;    // περιφέρεια/πολιτεία, π.χ. "Attica"
  latitude: number;
  longitude: number;
}

// Ο καιρός «τώρα»
export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;   // «αίσθηση» θερμοκρασίας
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  is_day: number;                 // 1 = μέρα, 0 = νύχτα
}

// Ωριαία δεδομένα: κάθε πεδίο είναι πίνακας, και το index i αντιστοιχεί στην ίδια ώρα
export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: (number | null)[];  // σε κάποιες περιοχές δεν υπάρχει
  weather_code: number[];
  is_day: number[];
}

// Ημερήσια δεδομένα: ίδια λογική, αλλά μία τιμή ανά μέρα
export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
}

// Οι «βολικοί» τύποι που θα χρησιμοποιούν τα components
export interface HourPoint {
  time: string;
  temperature: number;
  precipitationProbability: number | null;
  weatherCode: number;
  isDay: boolean;
}

export interface DayPoint {
  date: string;
  weatherCode: number;
  min: number;
  max: number;
  precipitationProbability: number | null;
}

// Ολόκληρη η απάντηση του Forecast API
export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}