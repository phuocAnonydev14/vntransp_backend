export interface IResponseError {
	statusCode: number;
	message: string;
	code: string;
	error: any;
	timestamp: string;
	path: string;
	method: string;
}

export const GlobalResponseError: (
	statusCode: number,
	message: string,
	code: string,
	error: any,
	request: Request
) => IResponseError = (
	statusCode: number,
	message: string,
	code: string,
	error: any,
	request: Request
): IResponseError => {
	return {
		statusCode: statusCode,
		message,
		code,
		error,
		timestamp: new Date().toISOString(),
		path: request.url,
		method: request.method
	};
};
