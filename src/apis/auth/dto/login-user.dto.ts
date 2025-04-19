import { IsNotEmpty, IsString } from '@/common/decorator/validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginUserDto {
	/** Login username */
	@ApiProperty({ description: 'Login email' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	/** Password */
	@ApiProperty({ description: 'Password' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
