import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	imageUrl?: string;

	@IsOptional()
	fileKey?: string;
}
