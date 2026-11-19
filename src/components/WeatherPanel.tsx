import { useForecast } from '../hooks/useForecast';
import { getWeatherInfo } from '../utils/weatherCodes';
import type { Place } from '../types/weather';

interface WeatherPanelProps {
  place: Place;
  onClose: () => void;
}

export function WeatherPanel({ place, onClose }: WeatherPanelProps) {
  const { data, isPending, isError, error } = useForecast(place);

  const subtitle = [place.admin1, place.country].filter(Boolean).join(', ');

  return (
    <aside className="panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <h2>{place.name}</h2>
      {subtitle && <p className="panel-subtitle">{subtitle}</p>}

      {isPending && <p>Loading weather…</p>}
      {isError && <p className="error">Could not load weather: {error.message}</p>}

      {data && (() => {
        const { current } = data;
        const info = getWeatherInfo(current.weather_code, current.is_day === 1);
        return (
          <>
            <div className="current">
              <span className="current-icon">{info.icon}</span>
              <div>
                <p className="current-temp">{Math.round(current.temperature_2m)}°C</p>
                <p>{info.label}</p>
              </div>
            </div>
            <ul className="current-details">
              <li>Feels like {Math.round(current.apparent_temperature)}°C</li>
              <li>Humidity {current.relative_humidity_2m}%</li>
              <li>Wind {Math.round(current.wind_speed_10m)} km/h</li>
            </ul>
          </>
        );
      })()}
    </aside>
  );
}