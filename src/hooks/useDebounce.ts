import { useEffect, useState } from 'react';

// Returns the value only after it has stopped changing for `delay` ms.
// Used for the search input so we don't send a request on every key press.
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // If the value changes before the timer ends, cancel the old timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
