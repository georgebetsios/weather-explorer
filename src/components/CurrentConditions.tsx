import { getWeatherInfo } from '../utils/weatherCodes';
import { formatHour } from '../utils/format';
import type { CurrentWeather } from '../types/weather';

interface CurrentConditionsProps {
  current: CurrentWeather;
}

export function CurrentConditions({ current }: CurrentConditionsProps) {
  const info = getWeatherInfo(current.weather_code, current.is_day === 1);

  return (
    <section>
      <div className="current">
        <span className="current-icon">{info.icon}</span>
        <div>
          <p className="current-temp">{Math.round(current.temperature_2m)}°C</p>
          <p>{info.label}</p>
        </div>
      </div>

      <p className="local-time">Local time {formatHour(current.time)}</p>

      <ul className="current-details">
        <li>Feels like {Math.round(current.apparent_temperature)}°C</li>
        <li>Humidity {current.relative_humidity_2m}%</li>
        <li>Wind {Math.round(current.wind_speed_10m)} km/h</li>
      </ul>
    </section>
  );
}