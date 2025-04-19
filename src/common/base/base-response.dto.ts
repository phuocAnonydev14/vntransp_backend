import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
	@ApiProperty({ description: 'ID', example: 1, type: 'number' })
	id!: number;

	@ApiProperty({ description: 'Created At', example: '2021-09-20T00:00:00', type: 'string' })
	createdAt!: string;

	@ApiProperty({ description: 'Updated At', example: '2021-09-20T00:00:00', type: 'string' })
	updatedAt!: string;
}
