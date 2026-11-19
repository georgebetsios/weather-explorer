import { useState } from 'react';
import { WeatherMap } from './components/WeatherMap';
import { WeatherPanel } from './components/WeatherPanel';
import type { Place } from './types/weather';

function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  function handleMapClick(latitude: number, longitude: number) {
    // Το Open-Meteo δεν έχει reverse geocoding (συντεταγμένες → όνομα),
    // οπότε για τα κλικ δείχνουμε τις συντεταγμένες ως όνομα.
    setSelectedPlace({
      id: `${latitude.toFixed(2)},${longitude.toFixed(2)}`,
      name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      latitude,
      longitude,
    });
  }

  return (
    <div className="app">
      <WeatherMap selectedPlace={selectedPlace} onMapClick={handleMapClick} />
      {selectedPlace && (
        <WeatherPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}

export default App;