import {
	Coord,
	CountryCode,
	Endpoint,
	Query,
	QueryCityId,
	QueryCityName,
	QueryCoordinates,
	QueryZip,
} from "./interfaces";

export function isCoord(x: any): x is Coord {
	const { lat, lon, ...rest } = x;

	return typeof lat === "number" && typeof lon === "number" && Object.keys(rest).length === 0;
}

export function isCountryCode(x: any): x is CountryCode {
	return typeof x === "string" && x.length === 2;
}

export function isEndpoint(x: any): x is Endpoint {
	return typeof x === "string" && Object.keys(Endpoint.TypeMap).includes(x);
}

export function isForecastEndpoint(x: any): x is Endpoint.Forecast {
	return isEndpoint(x) && x === Endpoint.Forecast;
}

export function isWeatherEndpoint(x: any): x is Endpoint.Weather {
	return isEndpoint(x) && x === Endpoint.Weather;
}

export function isQuery(x: any): x is Query<any> {
	return isQueryCityId(x) || isQueryCityName(x) || isQueryCoordinates(x) || isQueryZip(x);
}

export function isQueryCityId(x: any): x is QueryCityId<any> {
	return typeof x === "object" && "id" in x;
}

export function isQueryCityName(x: any): x is QueryCityName<any> {
	return typeof x === "object" && "q" in x;
}

export function isQueryCoordinates(x: any): x is QueryCoordinates<any> {
	return typeof x === "object" && "lat" in x && "lon" in x;
}

export function isQueryZip(x: any): x is QueryZip<any> {
	return typeof x === "object" && "zip" in x;
}
