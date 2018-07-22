import {
	Coord,
	CountryCode,
	Endpoint,
	RequestQuery,
	QueryByCityId,
	QueryByCityName,
	QueryByCoordinates,
	QueryByZip,
} from "./interfaces";

export function isCoord(x: any): x is Coord {
	return typeof x === "object" && "lat" in x && "lon" in x;
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

export function isRequestQuery(x: any): x is RequestQuery<any> {
	return isQueryByCityId(x) || isQueryByCityName(x) || isQueryByCoordinates(x) || isQueryByZip(x);
}

export function isQueryByCityId(x: any): x is QueryByCityId {
	return typeof x === "object" && "id" in x;
}

export function isQueryByCityName(x: any): x is QueryByCityName {
	return typeof x === "object" && "q" in x;
}

export function isQueryByCoordinates(x: any): x is QueryByCoordinates {
	return isCoord(x);
}

export function isQueryByZip(x: any): x is QueryByZip {
	return typeof x === "object" && "zip" in x;
}
