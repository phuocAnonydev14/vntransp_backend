import * as validator from 'class-validator';
import { applyDecorators } from '@nestjs/common';

import { logger, MsgIds } from '../logger/logger';

export const IsString = (validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.IsString({ ...validationOptions, message: logger.getMessage(MsgIds.M001001) })
	);

export const IsNotEmpty = (validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.IsNotEmpty({
			...validationOptions,
			message: logger.getMessage(MsgIds.M001002)
		})
	);

export const IsEmail = (validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.IsEmail({}, { ...validationOptions, message: logger.getMessage(MsgIds.M001003) })
	);

export const IsNumber = (
	options?: validator.IsNumberOptions,
	validationOptions?: validator.ValidationOptions
) =>
	applyDecorators(
		validator.IsNumber(options, {
			...validationOptions,
			message: logger.getMessage(MsgIds.M001004)
		})
	);

export const IsNumberString = (validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.IsNumberString(
			{},
			{
				...validationOptions,
				message: logger.getMessage(MsgIds.M001005)
			}
		)
	);

export const IsDateString = (validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.IsDateString(
			{},
			{
				...validationOptions,
				message: logger.getMessage(MsgIds.M001006)
			}
		)
	);

export const Min = (minValue: number, validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.Min(minValue, {
			...validationOptions,
			message: logger.getMessage(MsgIds.M001007)
		})
	);

export const Max = (maxValue: number, validationOptions?: validator.ValidationOptions) =>
	applyDecorators(
		validator.Max(maxValue, {
			...validationOptions,
			message: logger.getMessage(MsgIds.M001008)
		})
	);

export function IsLessThan(property: string, validationOptions?: validator.ValidationOptions) {
	return function (object: object, propertyName: string) {
		validator.registerDecorator({
			name: 'isLessThan',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: any, args: validator.ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return value < relatedValue;
				},
				defaultMessage(args: validator.ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					return `${args.property} must be less than ${relatedPropertyName}`;
				}
			}
		});
	};
}

export function IsLessThanOrEqualTo(
	property: string,
	validationOptions?: validator.ValidationOptions
) {
	return function (object: object, propertyName: string) {
		validator.registerDecorator({
			name: 'isLessThanOrEqualTo',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: any, args: validator.ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return (
						typeof value === 'number' &&
						typeof relatedValue === 'number' &&
						value <= relatedValue
					);
				},
				defaultMessage(args: validator.ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					return `${args.property} must be less than or equal to ${relatedPropertyName}`;
				}
			}
		});
	};
}
