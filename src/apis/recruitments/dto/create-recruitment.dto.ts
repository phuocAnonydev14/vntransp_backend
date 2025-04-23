import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRecruitmentDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	salary: number;

	// @IsOptional()
	// @IsString()
	// type: string; // fulltime or part-time

	@IsString()
	@IsOptional()
	location?: string;

	@IsArray()
	@IsOptional()
	requirements?: string[];

	@IsArray()
	@IsOptional()
	benefits?: string[];

	@IsString()
	deadline: string;
}
