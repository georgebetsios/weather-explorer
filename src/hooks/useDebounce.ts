import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Ξεκινάμε ένα χρονόμετρο: σε `delay` ms, ενημέρωσε την τιμή
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: αν το `value` αλλάξει ΠΡΙΝ λήξει το χρονόμετρο,
    // η React τρέχει αυτή τη συνάρτηση και ακυρώνει το παλιό χρονόμετρο
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}