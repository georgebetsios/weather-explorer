import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCurrentForPlaces, roundCoord } from '../api/openMeteo';
import type { Place } from '../types/weather';

export function usePlacesWeather(places: Place[]) {
  return useQuery({
    queryKey: [
      'current-batch',
      places.map((place) => `${roundCoord(place.latitude)},${roundCoord(place.longitude)}`),
    ],
    queryFn: () => fetchCurrentForPlaces(places),
    enabled: places.length > 0,
    placeholderData: keepPreviousData, // όσο έρχονται νέα, δείξε τις παλιές θερμοκρασίες
  });
}