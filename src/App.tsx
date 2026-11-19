import { useState } from 'react';
import { WeatherMap } from './components/WeatherMap';
import { WeatherPanel } from './components/WeatherPanel';
import { SearchBar } from './components/SearchBar';
import { MyPlaces } from './components/MyPlaces';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { useSavedPlaces } from './hooks/useSavedPlaces';
import { usePlacesWeather } from './hooks/usePlacesWeather';
import type { Place } from './types/weather';

function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  const saved = useSavedPlaces();
  const savedWeather = usePlacesWeather(saved.places);

  function showPlace(place: Place) {
    setSelectedPlace(place);
    setFocusPlace(place);
  }

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
        savedPlaces={saved.places}
        savedWeather={savedWeather.data}
        onMapClick={handleMapClick}
        onSelectPlace={setSelectedPlace}   // κλικ σε marker: επιλογή χωρίς "πτήση"
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

      <MyPlaces
        places={saved.places}
        weather={savedWeather.data}
        isError={savedWeather.isError}
        selectedPlaceId={selectedPlace?.id ?? null}
        onSelect={showPlace}               // κλικ στη λίστα: επιλογή ΚΑΙ "πτήση"
        onRemove={saved.removePlace}
      />

      {selectedPlace && (
        <WeatherPanel
          place={selectedPlace}
          isSaved={saved.isSaved(selectedPlace.id)}
          onToggleSave={saved.togglePlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
}

export default App;