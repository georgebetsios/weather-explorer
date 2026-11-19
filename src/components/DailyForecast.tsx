import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature, formatWeekday } from '../utils/format';
import type { DayPoint } from '../types/weather';

interface DailyForecastProps {
  days: DayPoint[];
}

export function DailyForecast({ days }: DailyForecastProps) {
  // Η χαμηλότερη και η υψηλότερη θερμοκρασία ΟΛΗΣ της εβδομάδας
  const weekMin = Math.min(...days.map((day) => day.min));
  const weekMax = Math.max(...days.map((day) => day.max));
  const weekRange = weekMax - weekMin || 1; // αποφεύγουμε διαίρεση με το 0

  return (
    <section className="forecast-section">
      <h3>7-day forecast</h3>
      <ul className="daily">
        {days.map((day, index) => {
          const info = getWeatherInfo(day.weatherCode);

          // Πού ξεκινάει και πόσο πλατιά είναι η μπάρα, σε ποσοστό (%)
          const left = ((day.min - weekMin) / weekRange) * 100;
          const width = ((day.max - day.min) / weekRange) * 100;

          return (
            <li key={day.date} className="day">
              <span className="day-name">{index === 0 ? 'Today' : formatWeekday(day.date)}</span>
              <span className="day-icon" title={info.label}>{info.icon}</span>
              <span className="day-min">{formatTemperature(day.min)}</span>
              <span className="day-bar">
                <span className="day-bar-fill" style={{ left: `${left}%`, width: `${width}%` }} />
              </span>
              <span className="day-max">{formatTemperature(day.max)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}