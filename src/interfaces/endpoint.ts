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
