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

// react-leaflet hooks only work inside <MapContainer>, so this is a separate component
function ClickHandler({ onMapClick }: { onMapClick: WeatherMapProps['onMapClick'] }) {
  useMapEvents({
    click(event) {
      // wrap() keeps the longitude between -180 and 180 when the map has been
      // dragged around the world
      const { lat, lng } = event.latlng.wrap();
      onMapClick(lat, lng);
    },
  });
  return null;
}

function FlyToPlace({ place }: { place: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (!place) return;
    // Zoom in to at least level 9, but don't zoom out if the user is already closer
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
  // Saved places already have a marker, so they don't need the extra circle
  const selectedIsSaved =
    selectedPlace !== null && savedPlaces.some((place) => place.id === selectedPlace.id);

  return (
    <MapContainer
      center={[30, 10]}
      zoom={3}
      minZoom={2}
      worldCopyJump
      zoomControl={false} // added again at the bottom right, the top left is used by the search
      className="map"
    >
      <TileLayer
        attribution='Weather data by <a href="https://open-meteo.com/">Open-Meteo.com</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

      {/* CircleMarker is drawn with SVG, so it avoids Leaflet's default marker image issue with Vite */}
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
