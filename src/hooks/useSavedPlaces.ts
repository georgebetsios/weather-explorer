import { useEffect, useState } from 'react';
import { DEFAULT_PLACES } from '../data/defaultPlaces';
import type { Place } from '../types/weather';

const STORAGE_KEY = 'weather-explorer:saved-places';

function loadPlaces(): Place[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Αν δεν υπάρχει τίποτα αποθηκευμένο = πρώτη επίσκεψη → προεπιλεγμένες πόλεις
    return stored ? (JSON.parse(stored) as Place[]) : DEFAULT_PLACES;
  } catch {
    // Χαλασμένο JSON ή μπλοκαρισμένο storage (π.χ. private mode)
    return DEFAULT_PLACES;
  }
}

export function useSavedPlaces() {
  // Lazy initializer: η loadPlaces τρέχει ΜΟΝΟ στο πρώτο render
  const [places, setPlaces] = useState<Place[]>(loadPlaces);

  // Κάθε φορά που αλλάζει η λίστα, την αποθηκεύουμε
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch {
      // Αν το storage είναι γεμάτο ή απενεργοποιημένο, απλώς δεν αποθηκεύουμε
    }
  }, [places]);

  function isSaved(placeId: string): boolean {
    return places.some((place) => place.id === placeId);
  }

  function togglePlace(place: Place) {
    setPlaces((current) =>
      current.some((p) => p.id === place.id)
        ? current.filter((p) => p.id !== place.id)  // υπάρχει → αφαίρεσέ το
        : [...current, place],                     // δεν υπάρχει → πρόσθεσέ το
    );
  }

  function removePlace(placeId: string) {
    setPlaces((current) => current.filter((place) => place.id !== placeId));
  }

  return { places, isSaved, togglePlace, removePlace };
}