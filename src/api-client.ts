import axios, { AxiosInstance, AxiosResponse } from "axios";
import qs from "query-string";

import { ApiResponse, Endpoint, ForecastResponse, Options, Units, WeatherResponse } from "./interfaces";
import { isEndpoint } from "./utils";
import { ApiException } from "./api-exception";

const DEFAULT_API_URL = "https://api.openweathermap.org/data/2.5";

export class OpenWeatherMapApiClient {
	apiKey: string;
	axios: AxiosInstance;
	units: Units;

	constructor(options: string | Options) {
		if (typeof options === "string") options = { apiKey: options };

		this.apiKey = options.apiKey;
		this.units = options.units || "standard";
		this.axios =
			options.axios ||
			axios.create({
				baseURL: options.apiUrl || DEFAULT_API_URL,
			});
	}

	async getByCityId(id: number): Promise<WeatherResponse>;
	async getByCityId(id: number, endpoint: "weather"): Promise<WeatherResponse>;
	async getByCityId(id: number, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByCityId(id: number, endpoint?: Endpoint): Promise<ApiResponse> {
		return this.request(endpoint, { id });
	}

	async getByCityName(cityName: string): Promise<WeatherResponse>;
	async getByCityName(cityName: string, endpoint: "weather"): Promise<WeatherResponse>;
	async getByCityName(cityName: string, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByCityName(cityName: string, country: string): Promise<WeatherResponse>;
	async getByCityName(cityName: string, country: string, endpoint: "weather"): Promise<WeatherResponse>;
	async getByCityName(cityName: string, country: string, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByCityName(cityName: string, country?: string | Endpoint, endpoint?: Endpoint): Promise<ApiResponse> {
		if (isEndpoint(country)) {
			endpoint = country;
			country = undefined;
		}

		const q = `${cityName}${country ? `,${country}` : ""}`;

		return this.request(endpoint, { q });
	}

	async getByCoordinates(lat: number, lon: number): Promise<WeatherResponse>;
	async getByCoordinates(lat: number, lon: number, endpoint: "weather"): Promise<WeatherResponse>;
	async getByCoordinates(lat: number, lon: number, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByCoordinates(lat: number, lon: number, endpoint?: Endpoint): Promise<ApiResponse> {
		return this.request(endpoint, { lat, lon });
	}

	async getByZip(zip: number | string): Promise<WeatherResponse>;
	async getByZip(zip: number | string, endpoint: "weather"): Promise<WeatherResponse>;
	async getByZip(zip: number | string, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByZip(zip: number | string, country: string): Promise<WeatherResponse>;
	async getByZip(zip: number | string, country: string, endpoint: "weather"): Promise<WeatherResponse>;
	async getByZip(zip: number | string, country: string, endpoint: "forecast"): Promise<ForecastResponse>;
	async getByZip(zip: number | string, country?: string | Endpoint, endpoint?: Endpoint): Promise<ApiResponse> {
		if (isEndpoint(country)) {
			endpoint = country;
			country = undefined;
		}

		zip = `${zip.toString()}${country ? `,${country}` : ""}`;

		return this.request(endpoint, { zip });
	}

	async request(endpoint = "weather", query = {}) {
		const queryString = qs.stringify({
			APPID: this.apiKey,
			units: (this.units !== "standard" && this.units) || undefined,
			...query,
		});

		let res: AxiosResponse;

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
}
