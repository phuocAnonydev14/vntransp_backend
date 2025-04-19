import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ description: 'Login username' })
	@IsString()
	@IsNotEmpty()
	username!: string;

	@ApiProperty({ description: 'Login email' })
	@IsEmail({}, { message: 'Email is invalid' })
	email!: string;

	@ApiProperty({ description: 'Login password' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
