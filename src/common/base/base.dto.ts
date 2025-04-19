import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from '../decorator/validation.decorator';
import { BaseEntity } from './base.entity';

export class PaginationDto<T = BaseEntity> {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => +(value || 10))
	@ApiProperty({
		description: 'Number of items per page',
		example: '10',
		type: 'string',
		required: false
	})
	limit?: number;

	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => +(value || 10))
	@ApiProperty({
		description: 'Current page number',
		example: '1',
		type: 'string',
		required: false
	})
	page?: number;

	@IsOptional()
	@Transform(({ value }) => JSON.parse(value || '{}'))
	@ApiProperty({
		description: 'Sort by field',
		example: '{ "createdAt": "ASC" }',
		type: 'string',
		required: false
	})
	order?: FindOptionsOrder<T>;

	@IsOptional()
	@Transform(({ value }) => JSON.parse(value || '{}'))
	@ApiProperty({
		description: 'Filter by field',
		example: '{ "name": "string" }',
		type: 'string',
		required: false
	})
	filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];

	@IsOptional()
	@ApiProperty({
		description: 'Search',
		example: '{ "username": "e" }',
		type: 'string',
		required: false
	})
	@Transform(({ value }) => JSON.parse(value || '{}'))
	search?: { [key: string]: string };
}
