// A location on the map. Search results, map clicks and the user's location
// all use this same shape.
export interface Place {
  id: string;
  name: string;
  country?: string;
  admin1?: string; // region / state
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  is_day: number; // 1 = day, 0 = night
}

// Hourly and daily data come as parallel arrays:
// time[i] and temperature_2m[i] belong to the same hour/day.
export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: (number | null)[]; // not available for every location
  weather_code: number[];
  is_day: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

// Easier-to-use shapes for the components (one object per hour/day)
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

// Just enough data for a marker on the map
export interface CurrentSnapshot {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}
