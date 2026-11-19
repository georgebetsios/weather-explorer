import type { Place } from '../types/weather';

// Τα id είναι τα ίδια που επιστρέφει το Geocoding API (GeoNames IDs),
// ώστε αν ο χρήστης ψάξει π.χ. "London", να αναγνωρίζεται ως ήδη αποθηκευμένο.
export const DEFAULT_PLACES: Place[] = [
  { id: '2643743', name: 'London', country: 'United Kingdom', latitude: 51.51, longitude: -0.13 },
  { id: '5128581', name: 'New York', country: 'United States', latitude: 40.71, longitude: -74.01 },
  { id: '1850147', name: 'Tokyo', country: 'Japan', latitude: 35.69, longitude: 139.69 },
  { id: '2147714', name: 'Sydney', country: 'Australia', latitude: -33.87, longitude: 151.21 },
  { id: '360630', name: 'Cairo', country: 'Egypt', latitude: 30.06, longitude: 31.25 },
  { id: '3451190', name: 'Rio de Janeiro', country: 'Brazil', latitude: -22.91, longitude: -43.18 },
  { id: '524901', name: 'Moscow', country: 'Russia', latitude: 55.75, longitude: 37.62 },
  { id: '3413829', name: 'Reykjavik', country: 'Iceland', latitude: 64.14, longitude: -21.9 },
  { id: '1275339', name: 'Mumbai', country: 'India', latitude: 19.07, longitude: 72.88 },
  { id: '264371', name: 'Athens', country: 'Greece', latitude: 37.98, longitude: 23.73 },
];