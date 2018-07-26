import { AxiosInstance } from "axios";

export type CityId = number;
export type CityName = string;
export type CountryCode = string;

export type Units = "imperial" | "metric" | "standard";
// export type Endpoint = "forecast" | "weather";
export type AccuracyType = "accurate" | "like";
export type Language =
	| "ar"
	| "bg"
	| "ca"
	| "cz"
	| "de"
	| "el"
	| "en"
	| "fa"
	| "fi"
	| "fr"
	| "gl"
	| "hr"
	| "hu"
	| "it"
	| "ja"
	| "kr"
	| "la"
	| "lt"
	| "mk"
	| "nl"
	| "pl"
	| "pt"
	| "ro"
	| "ru"
	| "se"
	| "sk"
	| "sl"
	| "es"
	| "tr"
	| "ua"
	| "vi"
	| "zh_cn"
	| "zh_tw";

export namespace Endpoint {
	export type Forecast = "forecast";
	export type Weather = "weather";

	export type Types = Forecast | Weather;

	export const Forecast: Forecast = "forecast";
	export const Weather: Weather = "weather";

	export const TypeMap: { [type: string]: string } = {
		[Forecast]: typeof Forecast,
		[Weather]: typeof Weather,
	};

	export function typeOf(x: string) {
		return x in TypeMap ? TypeMap[x] : undefined;
	}
}

export type Endpoint = Endpoint.Types;

export interface Coord {
	lat: number;
	lon: number;
}

export interface City {
	id: number;
	name: string;
	coord: Coord;
	country: string;
	population?: number;
}

export interface Main {
	grnd_level: number;
	humidity: number;
	pressure: number;
	sea_level: number;
	temp: number;
	temp_min: number;
	temp_max: number;
}

export interface Weather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface Wind {
	speed: number;
	deg: number;
	gust: number;
}

export interface Clouds {
	all: number;
}

export interface Rain {
	"3h": number;
}

export interface Snow {
	"3h": number;
}

export interface QueryByCityId {
	id: number;
}

export interface QueryByCityName {
	q: string;
}

export interface QueryByCoordinates extends Coord {}

export interface QueryByZip {
	zip: number | string;
}

export interface BaseQuery<T extends Endpoint | undefined> {
	endpoint?: T;
	lang?: Language;
	type?: AccuracyType;
	units?: Units;
}

export type Request<T extends Endpoint | undefined, Q> = BaseQuery<T> & { [P in keyof Q]: Q[P] };

export type RequestQuery<T extends Endpoint | undefined> =
	| Request<T, QueryByCityId>
	| Request<T, QueryByCityName>
	| Request<T, QueryByCoordinates>
	| Request<T, QueryByZip>;

export interface ResponseBase {
	cod: number;
	message?: string;
}

export interface WeatherResponse extends ResponseBase {
	base: string;
	dt: number;
	id: number;
	name: string;

	coord: Coord;
	main: Main;
	weather: Weather[];
	wind: Wind;
	clouds: Clouds;
	rain: Rain;
	snow: Snow;

	sys: {
		type: number;
		id: number;
		message: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
}

export interface ForecastResponse extends ResponseBase {
	cnt: number;
	city: City;

	list: {
		dt: number;
		dt_txt: string;
		main: Main;
		weather: Weather[];
		clouds: Clouds;
		wind: Wind;

		sys: {
			pod: string;
		};
	}[];
}

export type Response<T extends Endpoint> = T extends Endpoint.Forecast
	? ForecastResponse
	: T extends Endpoint.Weather ? WeatherResponse : never;

export interface Options {
	apiKey: string;
	apiUrl?: string;
	axios?: AxiosInstance;
	endpoint?: Endpoint;
	lang?: Language;
	units?: Units;
}
