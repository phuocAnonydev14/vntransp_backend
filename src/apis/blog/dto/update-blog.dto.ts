import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto {
	@ApiProperty({
		description: 'Title in English',
		example: 'Title in English',
		required: true
	})
	title_EN: string;

	@ApiProperty({
		description: 'Title in Vietnamese',
		example: 'Title in Vietnamese',
		required: true
	})
	title_VN: string;

	@ApiProperty({
		description: 'Content in English',
		example: 'Content in English',
		required: true
	})
	content_EN: string;

	@ApiProperty({
		description: 'Content in Vietnamese',
		example: 'Content in Vietnamese',
		required: true
	})
	content_VN: string;

	@ApiProperty({
		description: 'Description in English',
		example: 'Description in English',
		required: true
	})
	desc_EN: string;

	@ApiProperty({
		description: 'Description in Vietnamese',
		example: 'Description in Vietnamese',
		required: true
	})
	desc_VN: string;

	@ApiProperty({ description: 'Draft', example: true, required: true })
	draft: boolean;
}
