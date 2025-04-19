import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
	@ApiProperty({ description: 'Current password', example: '123456' })
	@IsNotEmpty()
	@IsString()
	oldPassword: string;

	@ApiProperty({ description: 'New password', example: '123456' })
	@IsNotEmpty()
	@IsString()
	newPassword: string;
}
