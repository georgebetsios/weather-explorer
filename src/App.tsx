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
  // The place shown in the weather panel
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  // The place the map should fly to (only set for search, location and the places list)
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  const saved = useSavedPlaces();
  const savedWeather = usePlacesWeather(saved.places);

  // Used when the place might be far away, so we also move the map there
  function showPlace(place: Place) {
    setSelectedPlace(place);
    setFocusPlace(place);
  }

  function handleMapClick(latitude: number, longitude: number) {
    // Open-Meteo has no reverse geocoding, so clicked points are named by their coordinates
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
        // The marker is already visible, so there is no need to move the map
        onSelectPlace={setSelectedPlace}
      />

      <div className="toolbar">
        <SearchBar onSelect={showPlace} />
        <button
          type="button"
          className="locate-button"
          onClick={location.locate}
          disabled={location.status === 'locating'}
          aria-label="Show weather at my location"
        >
          <span aria-hidden="true">📍</span>
          <span className="locate-label">
            {location.status === 'locating' ? 'Locating…' : 'My location'}
          </span>
        </button>
        {location.status === 'error' && <p className="toolbar-error">{location.error}</p>}
      </div>

      <MyPlaces
        places={saved.places}
        weather={savedWeather.data}
        isError={savedWeather.isError}
        selectedPlaceId={selectedPlace?.id ?? null}
        onSelect={showPlace}
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
