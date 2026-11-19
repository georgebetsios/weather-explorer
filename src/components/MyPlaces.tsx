import { useState } from 'react';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/format';
import type { CurrentSnapshot, Place } from '../types/weather';

type SortOrder = 'added' | 'warmest' | 'coldest';

interface MyPlacesProps {
  places: Place[];
  weather: Record<string, CurrentSnapshot> | undefined;
  isError: boolean;
  selectedPlaceId: string | null;
  onSelect: (place: Place) => void;
  onRemove: (placeId: string) => void;
}

export function MyPlaces({
  places,
  weather,
  isError,
  selectedPlaceId,
  onSelect,
  onRemove,
}: MyPlacesProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('added');
    // Σε μικρές οθόνες η λίστα ξεκινάει κλειστή, για να φαίνεται ο χάρτης
  const [isCollapsed, setIsCollapsed] = useState(
    () => window.matchMedia('(max-width: 700px)').matches,
  );

  // [...places] = αντίγραφο, γιατί η .sort() αλλάζει τον αρχικό πίνακα!
    const sortedPlaces =
    sortOrder === 'added'
      ? [...places].reverse()   // τα πιο πρόσφατα πρώτα
      : [...places].sort((a, b) => {
          const tempA = weather?.[a.id]?.temperature;
          const tempB = weather?.[b.id]?.temperature;
          if (tempA === undefined) return 1;
          if (tempB === undefined) return -1;
          return sortOrder === 'warmest' ? tempB - tempA : tempA - tempB;
        });

  return (
    <section className="my-places">
      <header className="my-places-header">
        <button
          type="button"
          className="my-places-toggle"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? '▸' : '▾'} My places ({places.length})
        </button>

        {!isCollapsed && places.length > 1 && (
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            aria-label="Sort places"
          >
            <option value="added">Recently added</option>
            <option value="warmest">Warmest first</option>
            <option value="coldest">Coldest first</option>
          </select>
        )}
      </header>

      {!isCollapsed && (
        <>
          {isError && <p className="my-places-info">Could not load weather for your places.</p>}
          {places.length === 0 && (
            <p className="my-places-info">Save places to compare their weather here.</p>
          )}

          <ul className="my-places-list">
            {sortedPlaces.map((place) => {
              const snapshot = weather?.[place.id];
              const info = snapshot ? getWeatherInfo(snapshot.weatherCode, snapshot.isDay) : null;

              return (
                <li
                  key={place.id}
                  className={place.id === selectedPlaceId ? 'is-selected' : undefined}
                >
                  <button type="button" className="my-place" onClick={() => onSelect(place)}>
                    <span className="my-place-icon">{info?.icon ?? '⏳'}</span>
                    <span className="my-place-name">{place.name}</span>
                    <span className="my-place-temp">
                      {snapshot ? formatTemperature(snapshot.temperature) : '–'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="my-place-remove"
                    onClick={() => onRemove(place.id)}
                    aria-label={`Remove ${place.name}`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}