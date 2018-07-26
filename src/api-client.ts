import axios, { AxiosInstance, AxiosResponse } from "axios";
import qs from "query-string";

import {
	Coord,
	CountryCode,
	Endpoint,
	ForecastResponse,
	Language,
	Options,
	Query,
	Response,
	Units,
	WeatherResponse,
} from "./interfaces";
import { isEndpoint, isCoord, isCountryCode, isQuery } from "./utils";
import { ApiException } from "./api-exception";

const DEFAULT_API_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_ENDPOINT: Endpoint = Endpoint.Weather;
const DEFAULT_LANGUAGE: Language = "en";
const DEFAULT_UNITS: Units = "standard";

const DEFAULT_OPTIONS: NonNullable<Pick<Options, "apiUrl" | "endpoint" | "lang" | "units">> = {
	apiUrl: DEFAULT_API_URL,
	endpoint: DEFAULT_ENDPOINT,
	lang: DEFAULT_LANGUAGE,
	units: DEFAULT_UNITS,
};

export class OwmApiClient {
	axios: AxiosInstance;
	options: Options;

	constructor(apiKey: string);
	constructor(options: Options);
	constructor(options: string | Options) {
		if (typeof options === "string") options = { apiKey: options };

		this.options = {
			...DEFAULT_OPTIONS,
			...options,
		};

		if (!("apiKey" in this.options)) {
			throw new Error("An API key (APPID) has to be set in order to use the API client.");
		}

		this.axios =
			this.options.axios ||
			axios.create({
				baseURL: this.options.apiUrl,
			});
	}

	// Returns the current weather for given query.
	async current(query: number | string | Coord | Query<Endpoint.Weather>): Promise<WeatherResponse> {
		return this.request("weather", this._prepQuery(query));
	}

	// Alias to `.current()`.
	async weather(query: number | string | Coord | Query<Endpoint.Weather>) {
		return this.current(query);
	}

	// Returns forecast for given query.
	async forecast(query: number | string | Coord | Query<Endpoint.Forecast>): Promise<ForecastResponse> {
		return this.request("forecast", this._prepQuery(query));
	}

	// Returns weather or forcast for city with given `id`.
	async getByCityId<T extends Endpoint>(id: number, endpoint?: T): Promise<Response<T>> {
		return this.request<T>({ endpoint, id });
	}

	// Returns weather or forecast for city with given `name` and optionally `country`.
	async getByCityName<T extends Endpoint>(name: string, endpoint?: T): Promise<Response<T>>;
	async getByCityName<T extends Endpoint>(name: string, country: CountryCode, endpoint?: T): Promise<Response<T>>;
	async getByCityName<T extends Endpoint>(
		name: string,
		countryOrEndpoint?: CountryCode | T,
		maybeEndpoint?: T
	): Promise<Response<T>> {
		const endpoint: T | undefined = isEndpoint(countryOrEndpoint)
			? countryOrEndpoint
			: isEndpoint(maybeEndpoint)
				? maybeEndpoint
				: undefined;

		const country: CountryCode | undefined = isCountryCode(countryOrEndpoint) ? countryOrEndpoint : undefined;

		const q = `${name}${country ? `,${country}` : ""}`;

		return this.request<T>({ endpoint, q });
	}

	// Returns weather or forecast at coordinates `lat`/`lon`.
	async getByCoordinates<T extends Endpoint>(lat: number, lon: number, endpoint?: T): Promise<Response<T>> {
		return this.request<T>({ endpoint, lat, lon });
	}

	// Returns weather or forcast for `zip` area with optional `country` (defaults
	// to "us" if none provided).
	async getByZip<T extends Endpoint>(zip: number | string, endpoint?: T): Promise<Response<T>>;
	async getByZip<T extends Endpoint>(zip: number | string, country: CountryCode, endpoint?: T): Promise<Response<T>>;
	async getByZip<T extends Endpoint>(
		zip: number | string,
		countryOrEndpoint?: CountryCode | T,
		maybeEndpoint?: T
	): Promise<Response<T>> {
		const endpoint: T | undefined = isEndpoint(countryOrEndpoint)
			? countryOrEndpoint
			: isEndpoint(maybeEndpoint)
				? maybeEndpoint
				: undefined;

		const country: CountryCode | undefined = isCountryCode(countryOrEndpoint) ? countryOrEndpoint : undefined;

		zip = `${zip.toString()}${country ? `,${country}` : ""}`;

		return this.request<T>({ endpoint, zip });
	}

	// Returns weather or forecast for given `query`.
	async request<T extends Endpoint>(query: Query<T>): Promise<Response<T>>;
	async request<T extends Endpoint>(endpoint: T | undefined, query: Query<any>): Promise<Response<T>>;
	async request<T extends Endpoint>(
		queryOrEndpoint: Query<T> | T | undefined,
		maybeQuery?: Query<T>
	): Promise<Response<T>> {
		const query: Query<T> | undefined = isQuery(maybeQuery)
			? maybeQuery
			: isQuery(queryOrEndpoint)
				? queryOrEndpoint
				: undefined;

		if (!isQuery(query)) {
			throw new Error("A proper request query must be provided to in order to make a request.");
		}

		const endpoint: T | undefined = isEndpoint(queryOrEndpoint)
			? queryOrEndpoint
			: isEndpoint(query.endpoint)
				? query.endpoint
				: isEndpoint(this.options.endpoint)
					? (this.options.endpoint as T)
					: undefined;

		if (!isEndpoint(endpoint)) {
			throw new Error(`A endpoint ("weather" or "forecast") must be defined in order to make a request.`);
		}

		const queryString = qs.stringify({
			APPID: this.options.apiKey,
			units: this.options.units,
			lang: this.options.lang,

			...query,
		});

		let res: AxiosResponse<Response<T>>;

		try {
			res = await this.axios.get(`${endpoint}?${queryString}`);
		} catch (err) {
			if (err.response && err.response.status) {
				throw new ApiException(
					(err.response.data && err.response.data.message) ||
						`OpenWeatherMap API responded with HTTP status ${
							err.response.status
						}, but provided no additional error information.`
				);
			}

			throw err;
		}

		return res.data;
	}

	// Preps `query` param for `.current()` and `.forecast()`, assuming `number`
	// represents a city ID, `string` represents city name and `Coord` represents
	// lat/lon coordiantes. If `query` is a valid `Query` object will use
	// that. Throws an error if no valid type was identified.
	protected _prepQuery(query: number | string | Coord | Query<Endpoint>) {
		if (typeof query === "number") query = { id: query };
		else if (typeof query === "string") query = { q: query };
		else if (isCoord(query) || isQuery(query)) query = { ...query };
		else throw new Error("Invalid value passed as request query.");

		return query as Query<Endpoint>;
	}
}
