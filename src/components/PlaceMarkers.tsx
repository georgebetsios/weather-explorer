import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/format';
import type { CurrentSnapshot, Place } from '../types/weather';

function createWeatherIcon(snapshot: CurrentSnapshot | undefined, isSelected: boolean) {
  const info = snapshot ? getWeatherInfo(snapshot.weatherCode, snapshot.isDay) : null;

  // ΠΡΟΣΟΧΗ: εδώ γράφουμε HTML ως string. Βάζουμε ΜΟΝΟ δικά μας δεδομένα
  // (εικονίδιο, αριθμό), ΠΟΤΕ ονόματα από το API (κίνδυνος XSS).
  const html = `
    <div class="weather-marker${isSelected ? ' is-selected' : ''}">
      <span>${info ? info.icon : '⏳'}</span>
      <strong>${snapshot ? formatTemperature(snapshot.temperature) : ''}</strong>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'weather-marker-wrapper', // αντικαθιστά το default στυλ του Leaflet
    iconSize: [64, 30],
    iconAnchor: [32, 15],                // το κέντρο του εικονιδίου «πατάει» στο σημείο
  });
}

interface PlaceMarkersProps {
  places: Place[];
  weather: Record<string, CurrentSnapshot> | undefined;
  selectedPlaceId: string | null;
  onSelect: (place: Place) => void;
}

export function PlaceMarkers({ places, weather, selectedPlaceId, onSelect }: PlaceMarkersProps) {
  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={createWeatherIcon(weather?.[place.id], place.id === selectedPlaceId)}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          {/* Το Tooltip το ζωγραφίζει η React, άρα το όνομα είναι ασφαλές εδώ */}
          <Tooltip direction="top" offset={[0, -14]}>
            {place.name}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}