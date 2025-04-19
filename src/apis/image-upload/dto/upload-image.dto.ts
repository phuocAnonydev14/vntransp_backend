import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsUrl } from 'class-validator';
import { ImageType } from '../imageTypes.enum';

export class UploadImageDto {
	@ApiPropertyOptional({
		description: 'Image file uploaded from client',
		type: 'string',
		format: 'binary',
		required: false
	})
	@IsOptional()
	file: any;

	@ApiPropertyOptional({
		description: 'Image URL link',
		example: 'https://example.com/image.jpg',
		required: false
	})
	@IsOptional({ always: true })
	@IsUrl()
	@Transform(({ value }) => (value === '' ? undefined : value))
	imgURL: string;

	@ApiPropertyOptional({
		description: 'Type image',
		example: 'Product | Wedding',
		enum: ImageType,
		required: false
	})
	@IsOptional()
	type: ImageType;

	@ApiPropertyOptional({
		description: 'Product ID',
		example: 1,
		type: Number,
		required: false
	})
	@IsOptional()
	product: number;

	@ApiPropertyOptional({
		description: 'Blog ID',
		example: 1,
		type: Number,
		required: false
	})
	@IsOptional()
	blog: number;

	@ApiPropertyOptional({
		description: 'Collect ID for wedding',
		example: 1,
		type: Number,
		required: false
	})
	@IsOptional()
	@Transform(({ value }) => (value === '' ? undefined : value))
	collect_id: number;

	@ApiPropertyOptional({
		description: 'Set ID of Collection',
		example: 1,
		type: Number,
		required: false
	})
	@IsOptional()
	@Transform(({ value }) => (value === '' ? undefined : value))
	set_id: number;

	@ApiPropertyOptional({
		description: 'Order image',
		example: 1,
		type: Number,
		required: false
	})
	@IsOptional()
	@Transform(({ value }) => (value === '' ? undefined : value))
	order: number;
}
