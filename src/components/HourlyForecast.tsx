import { getWeatherInfo } from '../utils/weatherCodes';
import { formatHour, formatTemperature } from '../utils/format';
import type { HourPoint } from '../types/weather';

interface HourlyForecastProps {
  hours: HourPoint[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <section className="forecast-section">
      <h3>Next 24 hours</h3>
      <ol className="hourly">
        {hours.map((hour, index) => {
          const info = getWeatherInfo(hour.weatherCode, hour.isDay);
          return (
            <li key={hour.time} className="hour">
              <span className="hour-time">{index === 0 ? 'Now' : formatHour(hour.time)}</span>
              <span className="hour-icon" title={info.label}>
                {info.icon}
              </span>
              <span className="hour-temp">{formatTemperature(hour.temperature)}</span>
              {/* Ternary instead of && so a 0% value doesn't render a "0" on the page */}
              {hour.precipitationProbability ? (
                <span className="hour-rain">💧{hour.precipitationProbability}%</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
