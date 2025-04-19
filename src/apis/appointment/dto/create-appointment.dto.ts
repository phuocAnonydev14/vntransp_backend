import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateAppointmentDto {
	@ApiProperty({ description: 'Name of customer', example: 'Name', required: true })
	name: string;

	@ApiProperty({ description: 'Phone of customer', example: '0123123123', required: true })
	phone: string;

	@IsOptional()
	@ApiProperty({ description: 'Location of appointment', example: 'Location' })
	location: string;

	@IsOptional()
	@ApiProperty({ description: 'Date of appointment', example: '2021-09-09' })
	date: Date;

	@IsOptional()
	@ApiProperty({ description: 'Time of appointment', example: '09:00' })
	time: string;

	@IsOptional()
	@ApiProperty({ description: 'Time of appointment', example: '09:00' })
	categoryId: number;

	@IsOptional()
	@ApiProperty({ description: 'Message of appointment', example: 'Message' })
	message: string;
}
