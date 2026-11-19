import { useEffect } from 'react';
import { useForecast } from '../hooks/useForecast';
import { getDailyForecast, getUpcomingHours } from '../utils/forecast';
import { CurrentConditions } from './CurrentConditions';
import { HourlyForecast } from './HourlyForecast';
import { DailyForecast } from './DailyForecast';
import type { Place } from '../types/weather';

interface WeatherPanelProps {
  place: Place;
  isSaved: boolean;
  onToggleSave: (place: Place) => void;
  onClose: () => void;
}

export function WeatherPanel({ place, isSaved, onToggleSave, onClose }: WeatherPanelProps) {
  const { data, isPending, isError, error, refetch } = useForecast(place);

  // Close the panel with the Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // filter(Boolean) removes missing parts
  const subtitle = [place.admin1, place.country].filter(Boolean).join(', ');

  return (
    <aside className="panel" aria-label={`Weather for ${place.name}`}>
      {/* Sticky header, so the name and close button stay visible while scrolling */}
      <header className="panel-header">
        <button className="panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{place.name}</h2>
        {subtitle && <p className="panel-subtitle">{subtitle}</p>}
      </header>

      <div className="panel-body">
        <button
          type="button"
          className={`save-button${isSaved ? ' is-saved' : ''}`}
          onClick={() => onToggleSave(place)}
          aria-pressed={isSaved}
        >
          {isSaved ? '★ Saved' : '☆ Save to my places'}
        </button>

        {isPending && <p className="panel-status">Loading weather…</p>}

        {isError && (
          <div className="error">
            <p>Could not load weather: {error.message}</p>
            <button type="button" className="retry-button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <CurrentConditions current={data.current} />
            <HourlyForecast hours={getUpcomingHours(data)} />
            <DailyForecast days={getDailyForecast(data)} />
          </>
        )}
      </div>
    </aside>
  );
}
