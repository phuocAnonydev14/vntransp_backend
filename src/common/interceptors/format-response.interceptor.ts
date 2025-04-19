import { Response } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<IResponse<any>> {
		const response = context.switchToHttp().getResponse<Response>();
		const status = response.statusCode;

		return next.handle().pipe(
			map((data) => {
				if (data.data && data.pagination) {
					return {
						status,
						message: 'success',
						data: data.data,
						pagination: data.pagination
					};
				}

				return {
					status,
					message: 'success',
					data
				};
			})
		);
	}

	private removeNullFields(obj: any): any {
		if (Array.isArray(obj)) {
			return obj.map((item) => this.removeNullFields(item));
		} else if (obj !== null && typeof obj === 'object') {
			return Object.entries(obj)
				.filter(([, value]) => value !== null)
				.reduce(
					(acc, [key, value]) => ({
						...acc,
						[key]: this.removeNullFields(value)
					}),
					{}
				);
		}
		return obj;
	}
}
