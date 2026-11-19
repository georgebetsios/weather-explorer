import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../api/openMeteo';

export function usePlaceSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['places', trimmed.toLowerCase()],
    queryFn: () => searchPlaces(trimmed),
    enabled: trimmed.length >= 2, // the geocoding API needs at least 2 characters
    staleTime: Infinity, // a city's coordinates never change
    placeholderData: keepPreviousData, // avoids the results list flickering while typing
  });
}
