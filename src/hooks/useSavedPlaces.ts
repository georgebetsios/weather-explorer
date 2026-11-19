import { useEffect, useState } from 'react';
import { DEFAULT_PLACES } from '../data/defaultPlaces';
import type { Place } from '../types/weather';

const STORAGE_KEY = 'weather-explorer:saved-places';

function loadPlaces(): Place[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Nothing stored means this is the first visit, so show the default cities.
    // If the user removed everything, "[]" is stored and we respect that.
    return stored ? (JSON.parse(stored) as Place[]) : DEFAULT_PLACES;
  } catch {
    // Broken JSON or storage blocked (e.g. some private browsing modes)
    return DEFAULT_PLACES;
  }
}

export function useSavedPlaces() {
  // Passing the function (not calling it) means localStorage is only read on the first render
  const [places, setPlaces] = useState<Place[]>(loadPlaces);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch {
      // Storage is full or disabled, the app still works without saving
    }
  }, [places]);

  function isSaved(placeId: string): boolean {
    return places.some((place) => place.id === placeId);
  }

  function togglePlace(place: Place) {
    setPlaces((current) =>
      current.some((p) => p.id === place.id)
        ? current.filter((p) => p.id !== place.id)
        : [...current, place],
    );
  }

  function removePlace(placeId: string) {
    setPlaces((current) => current.filter((place) => place.id !== placeId));
  }

  return { places, isSaved, togglePlace, removePlace };
}
