import { useQuery } from '@tanstack/react-query';
import { fetchForecast, roundCoord } from '../api/openMeteo';
import type { Place } from '../types/weather';

export function useForecast(place: Place | null) {
  return useQuery({
    // Same rounded coordinates = same cache entry
    queryKey: [
      'forecast',
      place ? roundCoord(place.latitude) : null,
      place ? roundCoord(place.longitude) : null,
    ],
    // Safe to use "!" here because the query only runs when place is not null
    queryFn: () => fetchForecast(place!.latitude, place!.longitude),
    enabled: place !== null,
  });
}
