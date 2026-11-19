import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../api/openMeteo';

export function usePlaceSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['places', trimmed.toLowerCase()],
    queryFn: () => searchPlaces(trimmed),
    enabled: trimmed.length >= 2,          // το Geocoding API θέλει τουλάχιστον 2 χαρακτήρες
    staleTime: Infinity,                   // οι συντεταγμένες μιας πόλης δεν αλλάζουν ποτέ
    placeholderData: keepPreviousData,     // κράτα τα παλιά αποτελέσματα όσο έρχονται τα νέα
  });
}