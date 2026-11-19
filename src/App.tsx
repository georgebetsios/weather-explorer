import { useState } from 'react';
import { WeatherMap } from './components/WeatherMap';
import { WeatherPanel } from './components/WeatherPanel';
import { SearchBar } from './components/SearchBar';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import type { Place } from './types/weather';

function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  // Για αναζήτηση και GPS: επιλέγουμε το μέρος ΚΑΙ μετακινούμε τον χάρτη
  function showPlace(place: Place) {
    setSelectedPlace(place);
    setFocusPlace(place);
  }

  // Για κλικ: επιλέγουμε το μέρος, ο χάρτης μένει ακίνητος
  function handleMapClick(latitude: number, longitude: number) {
    setSelectedPlace({
      id: `${latitude.toFixed(2)},${longitude.toFixed(2)}`,
      name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      latitude,
      longitude,
    });
  }

  const location = useCurrentLocation(showPlace);

  return (
    <div className="app">
      <WeatherMap
        selectedPlace={selectedPlace}
        focusPlace={focusPlace}
        onMapClick={handleMapClick}
      />

      <div className="toolbar">
        <SearchBar onSelect={showPlace} />
        <button
          type="button"
          className="locate-button"
          onClick={location.locate}
          disabled={location.status === 'locating'}
        >
          {location.status === 'locating' ? 'Locating…' : '📍 My location'}
        </button>
        {location.status === 'error' && <p className="toolbar-error">{location.error}</p>}
      </div>

      {selectedPlace && (
        <WeatherPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}

export default App;