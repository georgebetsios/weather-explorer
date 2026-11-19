# 🌍 Weather Explorer

Explore the weather anywhere in the world, the way a TV weather presenter would — but you are in control.

Click anywhere on the map, search for a city, or use your current location to see the weather there. Save the places you discover and they appear on the map with their live conditions, so you can build up your own picture of the world's weather and compare places at a glance.

**Live demo:** https://weather-explorer-henna.vercel.app


## Features

- **Interactive world map** – click any point on Earth to see its weather.
- **City search** – debounced search powered by the Open-Meteo Geocoding API, with Greek-language support.
- **My location** – one click to see the weather where you are (browser Geolocation API).
- **Detailed forecast panel** – current conditions, local time, next 24 hours and a 7-day forecast with temperature range bars that make days easy to compare.
- **My places** – save places; they are shown on the map as weather markers (icon + temperature) and in a list that can be sorted by warmest/coldest. Saved places persist in `localStorage`.
- **World overview on first visit** – 10 cities on different continents are pre-loaded, so the map is useful immediately (users can remove them).
- **Responsive** – on mobile the forecast becomes a bottom sheet and the places list starts collapsed.
- **Accessible** – keyboard-friendly controls, ARIA labels, `Escape` closes the panel.

---

## 1. Installation and setup

### Prerequisites

- [Node.js](https://nodejs.org/) **20.19+** or **22+**
- npm (comes with Node.js)

### Install and run

```bash
git clone https://github.com/georgebetsios/weather-explorer.git
cd weather-explorer
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

### Other scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the development server                 |
| `npm run build`   | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally         |
| `npm run lint`    | Run the linter                               |

### Environment variables

**None required.** Open-Meteo and the OpenStreetMap tiles do not need API keys, so the project runs right after `npm install`.

---

## 2. Implementation choices

### Stack

| Choice | Why |
| --- | --- |
| **React + TypeScript** | Component model fits a UI made of independent pieces (map, search, panel, list). TypeScript models the API responses and catches mistakes at compile time. |
| **Vite** | Fast dev server and build, the current standard for React projects. |
| **TanStack Query** (`@tanstack/react-query`) | Handles loading/error states, retries and — most importantly — **caching**, which is central to staying within Open-Meteo's usage limits. |
| **Leaflet + react-leaflet** | Lightweight, mature open-source map library. Used with OpenStreetMap tiles, which need no API key. |
| **Plain CSS** | The UI is small enough that a CSS framework would add more weight than value. |
| **Browser APIs** | `Geolocation` for current location, `localStorage` for saved places, `Intl.DateTimeFormat` for dates (no date library needed). |

### Being mindful of API usage

The brief asks to be careful with the number of requests. The app:

1. **Caches forecasts for 10 minutes** (`staleTime`). Open-Meteo updates roughly every 15 minutes, so refetching more often gives no new data. Revisiting a place within that window makes no request.
2. **Rounds coordinates to 2 decimals (~1 km)** before building the request and the cache key, so nearby clicks share cached data.
3. **Batches saved places into a single request.** Open-Meteo accepts comma-separated coordinates, so the current weather for all saved places is fetched in one HTTP request instead of one per place.
4. **Debounces search (300 ms)**, so typing "Thessaloniki" sends one request instead of twelve.
5. **Caches geocoding results forever** for the session (`staleTime: Infinity`), because a city's coordinates never change.
6. **Disables refetch on window focus**, and only requests the variables that are actually displayed.

### Other notable decisions

- **Time zones:** forecasts are requested with `timezone=auto`, so all times are in the place's local time. "Now" is taken from the API's `current.time` rather than the user's clock — so the hourly forecast for Tokyo correctly starts at Tokyo's current hour.
- **Batch results keyed by place id:** the batch request returns `{ [placeId]: weather }` instead of an array. While new data loads, previous data is kept on screen; with an array, removing a place would briefly shift temperatures onto the wrong places.
- **Security:** map markers are built from HTML strings (`L.divIcon`), so only app-controlled values (icon and number) go into that HTML. Place names come from the API and are rendered through React (tooltips), which escapes them, avoiding XSS.
- **One `Place` type** for search results, map clicks and geolocation, so every way of finding a place flows through the same code.

### Project structure

```
src/
  api/          Open-Meteo requests (forecast, batch current weather, geocoding)
  components/   UI: map, markers, search, weather panel, forecast sections, places list
  data/         Default places shown on first visit
  hooks/        useForecast, usePlacesWeather, usePlaceSearch, useSavedPlaces,
                useCurrentLocation, useDebounce
  types/        TypeScript types for API responses and app data
  utils/        Weather code → icon/label, forecast transforms, formatting
```

---

## 3. Incomplete requirements / known limitations

- **Clicked points have no name.** Open-Meteo has no reverse geocoding (coordinates → place name), so a clicked point is labelled by its coordinates.
- **No automated tests.** Given the time frame, I focused on the features and tested manually.
- **Celsius and km/h only** – no unit switch.
- **Search language detection is Greek-only.** Greek input is searched in Greek; everything else in English.
- **Saved "My location"** is stored as a fixed point and keeps the name "My location".
- **Map tiles:** OpenStreetMap's public tile servers are meant for light use. A production version would use a commercial tile provider (e.g. MapTiler, Mapbox).

---

## 4. Next steps

With more time I would:

- **Add tests** for the main parts of the app, like the forecast data and the search.
- **Show real names for clicked points** instead of coordinates.
- **Add a °C / °F switch.**
- **Add a time slider**, so users can see how the weather on the map changes over the next hours, like a TV forecast.

---

## 5. Additional notes

- **Data sources:** weather data by [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0); map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- **AI tools:** I used an AI assistant as a pair-programming partner while building the app. I went through each step, made the design decisions and can explain every part of the code.
- **Commit history:** the project was built in small steps; the commit history shows how it evolved.
