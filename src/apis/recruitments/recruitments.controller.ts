import { PaginationDto } from '@/common/base/base.dto';
import { ApiController, ApiCreate, ApiGetAll, ApiGetOne } from '@/common/base/base.swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RecruitmentEntity } from './recruitment.entity';
import { RecruitmentService } from './recruitments.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';

@Controller('recruitment')
@ApiController('Recruitment')
@ApiBearerAuth('access-token')
export class RecruitmentController {
	constructor(private readonly recruitmentService: RecruitmentService) {}

	@Post()
	@ApiCreate(RecruitmentEntity, 'Recruitment')
	create(@Body() createRecruitmentDto: CreateRecruitmentDto) {
		return this.recruitmentService.createRecruitment(createRecruitmentDto);
	}

	@Get()
	@ApiGetAll(RecruitmentEntity, 'Recruitment')
	findAll(@Query() query: PaginationDto) {
		return this.recruitmentService.getAllPaginated({ ...query });
	}

	@Get(':id')
	@ApiGetOne(RecruitmentEntity, 'Recruitment')
	findOne(@Param('id') id: string) {
		return this.recruitmentService.getOneByIdOrFail(Number(id));
	}
}
