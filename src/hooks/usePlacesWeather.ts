import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCurrentForPlaces, roundCoord } from '../api/openMeteo';
import type { Place } from '../types/weather';

// Current weather for all saved places, fetched with a single batch request.
// Note: adding or removing a place changes the key, so all places are fetched again.
export function usePlacesWeather(places: Place[]) {
  return useQuery({
    queryKey: [
      'current-batch',
      places.map((place) => `${roundCoord(place.latitude)},${roundCoord(place.longitude)}`),
    ],
    queryFn: () => fetchCurrentForPlaces(places),
    enabled: places.length > 0,
    placeholderData: keepPreviousData, // keep showing old temperatures while new ones load
  });
}
