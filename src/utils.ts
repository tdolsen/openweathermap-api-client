import { Endpoint } from "./interfaces";

export function isEndpoint(x: any): x is Endpoint {
	return typeof x === "string" && ["weather", "forecast"].includes(x);
}
