import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App.tsx';

// Open-Meteo updates its data roughly every 15 minutes, so refetching more often
// gives us nothing new. Caching like this also keeps us within the free API limits.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // data is considered fresh for 10 minutes
      gcTime: 30 * 60 * 1000, // unused data is removed from the cache after 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
