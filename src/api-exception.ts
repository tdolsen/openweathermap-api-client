export class ApiException extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, ApiException.prototype);
	}
}
