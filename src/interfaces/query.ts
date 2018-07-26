import { Endpoint } from "./endpoint";
import { Language, AccuracyType, Units } from "./options";

export type CityId = number;
export type CityName = string;
export type CountryCode = string;

export interface QueryBase<T extends Endpoint> {
	endpoint?: T;
	lang?: Language;
	type?: AccuracyType;
	units?: Units;
}

export interface QueryCityId<T extends Endpoint> extends QueryBase<T> {
	id: number;
}

export interface QueryCityName<T extends Endpoint> extends QueryBase<T> {
	q: string;
}

export interface QueryCoordinates<T extends Endpoint> extends QueryBase<T> {
	lat: number;
	lon: number;
}

export interface QueryZip<T extends Endpoint> extends QueryBase<T> {
	zip: number | string;
}

export type Query<T extends Endpoint> = QueryCityId<T> | QueryCityName<T> | QueryCoordinates<T> | QueryZip<T>;
