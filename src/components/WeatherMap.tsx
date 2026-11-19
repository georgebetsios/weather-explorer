import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { Place } from '../types/weather';

interface WeatherMapProps {
  selectedPlace: Place | null;
  focusPlace: Place | null;   // το μέρος στο οποίο πρέπει να "πετάξει" ο χάρτης
  onMapClick: (latitude: number, longitude: number) => void;
}

function ClickHandler({ onMapClick }: { onMapClick: WeatherMapProps['onMapClick'] }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng.wrap();
      onMapClick(lat, lng);
    },
  });
  return null;
}

// Κάθε φορά που αλλάζει το focusPlace, κινεί τον χάρτη εκεί με animation
function FlyToPlace({ place }: { place: Place | null }) {
  const map = useMap(); // πρόσβαση στο αντικείμενο του Leaflet

  useEffect(() => {
    if (!place) return;
    map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 9), {
      duration: 1.2,
    });
  }, [map, place]);

  return null;
}

export function WeatherMap({ selectedPlace, focusPlace, onMapClick }: WeatherMapProps) {
  return (
    <MapContainer
      center={[30, 10]}
      zoom={3}
      minZoom={2}
      worldCopyJump
      zoomControl={false}   // βγάζουμε το default (πάνω αριστερά, εκεί θα μπει η αναζήτηση)
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <ClickHandler onMapClick={onMapClick} />
      <FlyToPlace place={focusPlace} />

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