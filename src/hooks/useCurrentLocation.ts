import { useState } from 'react';
import type { Place } from '../types/weather';

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
      (position) => {
        const { latitude, longitude } = position.coords;
        setStatus('idle');
        onLocated({
          // The id includes the coordinates, so a saved location doesn't clash with a new one
          id: `location-${latitude.toFixed(2)},${longitude.toFixed(2)}`,
          name: 'My location',
          latitude,
          longitude,
        });
      },
      (err) => {
        setStatus('error');
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'Could not get your location.',
        );
      },
      {
        enableHighAccuracy: false, // GPS accuracy isn't needed for weather and it's slower
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // a position from the last 5 minutes is good enough
      },
    );
  }

  return { locate, status, error };
}
