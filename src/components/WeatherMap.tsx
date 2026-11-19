import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import type { Place } from '../types/weather';

interface WeatherMapProps {
  selectedPlace: Place | null;
  onMapClick: (latitude: number, longitude: number) => void;
}

// Ξεχωριστό component, επειδή το useMapEvents δουλεύει ΜΟΝΟ μέσα στο <MapContainer>
function ClickHandler({ onMapClick }: { onMapClick: WeatherMapProps['onMapClick'] }) {
  useMapEvents({
    click(event) {
      // .wrap(): αν ο χρήστης έχει σύρει τον χάρτη «γύρω από τη Γη», το longitude
      // μπορεί να βγει π.χ. 200. Το wrap το φέρνει πίσω στο -180..180.
      const { lat, lng } = event.latlng.wrap();
      onMapClick(lat, lng);
    },
  });
  return null; // δεν ζωγραφίζει τίποτα, μόνο «ακούει»
}

export function WeatherMap({ selectedPlace, onMapClick }: WeatherMapProps) {
  return (
    <MapContainer center={[30, 10]} zoom={3} minZoom={2} worldCopyJump className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />

      {selectedPlace && (
        <CircleMarker
          center={[selectedPlace.latitude, selectedPlace.longitude]}
          radius={8}
          pathOptions={{ color: '#38bdf8', fillOpacity: 0.8 }}
        />
      )}
    </MapContainer>
  );
}