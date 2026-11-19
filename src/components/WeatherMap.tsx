import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { PlaceMarkers } from './PlaceMarkers';
import type { CurrentSnapshot, Place } from '../types/weather';

interface WeatherMapProps {
  selectedPlace: Place | null;
  focusPlace: Place | null;
  savedPlaces: Place[];
  savedWeather: Record<string, CurrentSnapshot> | undefined;
  onMapClick: (latitude: number, longitude: number) => void;
  onSelectPlace: (place: Place) => void;
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

export function WeatherMap({
  selectedPlace,
  focusPlace,
  savedPlaces,
  savedWeather,
  onMapClick,
  onSelectPlace,
}: WeatherMapProps) {
  // Αν το επιλεγμένο μέρος είναι αποθηκευμένο, έχει ήδη marker, οπότε δεν χρειάζεται κύκλος
  const selectedIsSaved =
    selectedPlace !== null && savedPlaces.some((place) => place.id === selectedPlace.id);

  return (
    <MapContainer
      center={[30, 10]}
      zoom={3}
      minZoom={2}
      worldCopyJump
      zoomControl={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <ClickHandler onMapClick={onMapClick} />
      <FlyToPlace place={focusPlace} />

      <PlaceMarkers
        places={savedPlaces}
        weather={savedWeather}
        selectedPlaceId={selectedPlace?.id ?? null}
        onSelect={onSelectPlace}
      />

      {selectedPlace && !selectedIsSaved && (
        <CircleMarker
          center={[selectedPlace.latitude, selectedPlace.longitude]}
          radius={8}
          pathOptions={{ color: '#38bdf8', fillOpacity: 0.8 }}
        />
      )}
    </MapContainer>
  );
}