import { useState } from 'react';
import type { Place } from '../types/weather';

// Union type: η τιμή μπορεί να είναι ΜΟΝΟ ένα από αυτά τα τρία strings
type LocationStatus = 'idle' | 'locating' | 'error';

export function useCurrentLocation(onLocated: (place: Place) => void) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  function locate() {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setError('Your browser does not support geolocation.');
      return;
    }

    setStatus('locating');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // 1η συνάρτηση: επιτυχία
      (position) => {
        const { latitude, longitude } = position.coords;
        setStatus('idle');
        onLocated({ id: 'current-location', name: 'My location', latitude, longitude });
      },
      // 2η συνάρτηση: αποτυχία
      (err) => {
        setStatus('error');
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'Could not get your location.',
        );
      },
      // Ρυθμίσεις
      {
        enableHighAccuracy: false,   // δεν χρειαζόμαστε GPS ακρίβειας για καιρό, και είναι πιο γρήγορο
        timeout: 10000,             // μετά από 10 δευτερόλεπτα, άσ' το
        maximumAge: 5 * 60 * 1000,   // δέξου θέση που βρέθηκε έως 5 λεπτά πριν
      },
    );
  }

  return { locate, status, error };
}