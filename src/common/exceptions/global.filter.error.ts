import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { GlobalResponseError } from './global.response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	logger = new Logger(GlobalExceptionFilter.name);
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		let message = (exception as any).response
			? (exception as any).response.message
			: (exception as any).message.message;
		let code = 'HttpException';
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		console.log('🚀 ~ GlobalExceptionFilter ~ exception:', exception);
		const error = (exception as any).response
			? (exception as any).response.errors
			: (exception as any).message.errors;

		this.logger.error(exception);
		if (exception instanceof HttpException) {
			status = exception.getStatus();
		} else if (
			exception instanceof QueryFailedError ||
			exception instanceof EntityNotFoundError ||
			exception instanceof CannotCreateEntityIdMapError
		) {
			status = HttpStatus.UNPROCESSABLE_ENTITY;
			message = (exception as Error).message;
			code = (exception as any).code;
		}
		response.status(status).json(GlobalResponseError(status, message, code, error, request));
	}
}
