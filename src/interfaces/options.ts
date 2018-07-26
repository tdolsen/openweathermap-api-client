import { AxiosInstance } from "axios";

import { Endpoint } from "./endpoint";

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

export interface Options {
	apiKey: string;
	apiUrl?: string;
	axios?: AxiosInstance;
	endpoint?: Endpoint;
	lang?: Language;
	units?: Units;
}
