import { PaginationDto } from '@/common/base/base.dto';
import { ApiController, ApiCreate, ApiGetAll, ApiGetOne } from '@/common/base/base.swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';

@Controller('appointment')
@ApiController('Appointment')
@ApiBearerAuth('access-token')
export class AppointmentController {
	constructor(private readonly appointmentService: AppointmentService) {}

	@Post()
	@ApiCreate(AppointmentEntity, 'Appointment')
	create(@Body() createAppointmentDto: CreateAppointmentDto) {
		return this.appointmentService.createAppointment(createAppointmentDto);
	}

	@Get()
	@ApiGetAll(AppointmentEntity, 'Appointment')
	findAll(@Query() query: PaginationDto) {
		return this.appointmentService.getAllPaginated({ ...query, relations: ['category'] });
	}

	@Get(':id')
	@ApiGetOne(AppointmentEntity, 'Appointment')
	findOne(@Param('id') id: string) {
		return this.appointmentService.getOneByIdOrFail(Number(id));
	}
}
