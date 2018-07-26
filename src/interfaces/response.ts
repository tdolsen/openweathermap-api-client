import { Endpoint } from "./endpoint";

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

export interface ForecastList {
	dt: number;
	dt_txt: string;
	main: Main;
	weather: Weather[];
	clouds: Clouds;
	wind: Wind;

	sys: {
		pod: string;
	};
}

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
	list: ForecastList[];
}

export type Response<T extends Endpoint> = T extends Endpoint.Forecast
	? ForecastResponse
	: T extends Endpoint.Weather ? WeatherResponse : never;
