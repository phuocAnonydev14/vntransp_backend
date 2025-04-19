import { IsNotEmpty } from '@/common/decorator/validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
	/** Login username */
	@ApiProperty({ description: 'Login email' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;
}
