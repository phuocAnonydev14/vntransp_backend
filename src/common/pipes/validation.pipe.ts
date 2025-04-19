import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
	Type
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToInstance(metatype, value);
		const errors = await validate(object);
		if (errors.length > 0) {
			throw new BadRequestException({
				message: 'Input data validation failed',
				errors: this.buildError(errors)
			});
		}
		return object;
	}

	private buildError(errors: any) {
		const result = {};
		errors.forEach((el: any) => {
			const prop = el.property;
			Object.entries(el.constraints).forEach(([, constraintValue]) => {
				const formattedValue =
					typeof constraintValue === 'object'
						? JSON.stringify(constraintValue)
						: constraintValue;
				result[`${prop}`] = formattedValue;
			});
		});
		return result;
	}

	private toValidate(metatype: Type<any>): boolean {
		const types: Type<any>[] = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}
}
