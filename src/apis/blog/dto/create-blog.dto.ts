import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateBlogDto {
	@ApiProperty({
		description: 'Title in English',
		example: 'Title in English',
		required: true
	})
	title: string;

	@ApiProperty({
		description: 'Content in English',
		example: 'Content in English',
		required: true
	})
	content: string;

	@Optional()
	@ApiProperty({
		description: 'Description in English',
		example: 'Description in English',
		required: true
	})
	desc: string;

	@IsOptional()
	imageUrl?: string;

	@IsOptional()
	fileKey?: string;

	@ApiProperty({ description: 'Draft', example: true, required: true })
	draft: boolean;
}
