import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserRoleDto {
	@ApiProperty({ description: 'Role Id' })
	@IsNotEmpty()
	@IsNumber()
	roleId!: number;
}
