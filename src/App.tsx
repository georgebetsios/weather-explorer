import { useEffect } from 'react';
import { fetchForecast, searchPlaces } from './api/openMeteo';

function App() {
  useEffect(() => {
    fetchForecast(37.98, 23.73).then((data) => console.log('Forecast:', data));
    searchPlaces('Thessaloniki').then((places) => console.log('Places:', places));
  }, []);

  return <h1>Weather Explorer</h1>;
}

export default App;