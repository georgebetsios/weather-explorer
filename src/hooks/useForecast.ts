import { useQuery } from '@tanstack/react-query';
import { fetchForecast, roundCoord } from '../api/openMeteo';
import type { Place } from '../types/weather';

export function useForecast(place: Place | null) {
  return useQuery({
    // Το "κλειδί" του cache: ίδιες στρογγυλεμένες συντεταγμένες = ίδια δεδομένα
    queryKey: [
      'forecast',
      place ? roundCoord(place.latitude) : null,
      place ? roundCoord(place.longitude) : null,
    ],
    queryFn: () => fetchForecast(place!.latitude, place!.longitude),
    enabled: place !== null, // αν δεν υπάρχει μέρος, μην κάνεις request
  });
}