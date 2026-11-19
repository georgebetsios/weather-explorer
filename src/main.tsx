import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,   // 10 λεπτά: τα δεδομένα θεωρούνται «φρέσκα»
      gcTime: 30 * 60 * 1000,      // 30 λεπτά: μετά σβήνονται από τη μνήμη
      refetchOnWindowFocus: false, // μην ξαναζητάς δεδομένα κάθε φορά που γυρνάς στο tab
      retry: 1,                    // σε αποτυχία, ξαναδοκίμασε μία φορά
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