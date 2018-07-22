# OpenWeatherMap API client

> Promise based API client for getting weather data and forecasts from
> openweathermap.org

## Installation

```sh
yarn add openweathermap-api-client
```

## Usage

```ts
import { ApiClient } from "openweathermap-api-client";

// Configure an instance
const client = new ApiClient({
  // The API key to authenticate with. Also refered to as APPID.
  apiKey: "0762980bd66840d04ea0e9bffe765113",

  // Default endpoint to use if none was explicitly set.
  endpoint: "weather",

  // Language code to use for translations for OWM data. Options can be found
  // here: https://openweathermap.org/current#multi
  lang: "en",

  // Which measuring system to use for units. default ("standard") returns
  // temperatures in Kelvin, "imperial" for Farenheit and "metric" for Celcius.
  units: "metric"
});

// Wrapping calls in an async function. You're free to use `then()`/`catch()` if
// you rather prefere that.
async function getWeatherData() {
  // current()
  // ---------
  // Returns the current weather data for given query.
  
  // Number is assumed to be a city ID, as defined by OWM.
  const currentCityId = await client.current(36482);

  // String is assumed to be a city name.
  const currentCityName = await client.current("Berlin");

  // Object with `lat` and `lon` properties is assumed to be geo coordinates.
  const currentCoord = await client.current({ lat: 59.970984, lon: 10.719908 });

  // Any other object is evaludated as one of `RequestQuery` types:
  // * CityId: `{ id: number }`
  // * CityName: `{ q: string }`
  // * Coord: `{ lat: number, lon: number }`
  // * Zip: `{ zip: number | string }`
  // 
  // All queries takes optional properties:
  // * `endpoint`: "weather" | "forcast"
  // * `lang`: 2-char long string
  // * `type`: "like" | "accurate"
  // * `units`: "standard" | "metric" | "imperial"
  const currentQuery = await client.current({  })

  // forecast()
  // ----------
  // Takes the exact same arguments as `current()`, but returns a three day
  // forecast instead of the current weather data.
  const forecastCityId = await client.forecast(36482);

  // In addition can you try out:
  // * `getByCityId()`
  // * `getByCityName()`
  // * `getByCoord()`
  // * `getByZip()`
}

// Start the API calls.
void getWeatherData();
```
