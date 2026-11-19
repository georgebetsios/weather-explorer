import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import type { Place } from '../types/weather';

interface SearchBarProps {
  onSelect: (place: Place) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // `query` updates on every key press (for the input),
  // `debouncedQuery` only after the user stops typing (for the API)
  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [], isFetching, isError } = usePlaceSearch(debouncedQuery);

  function handleSelect(place: Place) {
    onSelect(place);
    setQuery('');
    setIsOpen(false);
  }

  const showDropdown = isOpen && debouncedQuery.trim().length >= 2;

  return (
    <div className="search">
      <input
        type="search"
        value={query}
        placeholder="Search a city…"
        aria-label="Search for a city"
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          // Enter picks the first result, Escape closes the list
          if (event.key === 'Enter' && results.length > 0) handleSelect(results[0]);
          if (event.key === 'Escape') setIsOpen(false);
        }}
      />

      {showDropdown && (
        <ul className="search-results">
          {isFetching && results.length === 0 && <li className="search-info">Searching…</li>}
          {isError && <li className="search-info">Search failed. Please try again.</li>}
          {!isFetching && !isError && results.length === 0 && (
            <li className="search-info">No places found</li>
          )}

          {results.map((place) => (
            <li key={place.id}>
              {/* Buttons so the results also work with the keyboard */}
              <button type="button" onClick={() => handleSelect(place)}>
                <strong>{place.name}</strong>
                <span>{[place.admin1, place.country].filter(Boolean).join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
