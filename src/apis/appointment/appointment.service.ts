import { BaseService } from '@/common/base/base.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class AppointmentService extends BaseService<AppointmentEntity> {
	notFoundMessage: string = 'Appointment not found';
	constructor(
		@InjectRepository(AppointmentEntity)
		private readonly appointmentRepo: Repository<AppointmentEntity>,
		@InjectQueue('subscribe-mail') private readonly sendMail: Queue
	) {
		super(appointmentRepo);
	}

	async createAppointment(
		createAppointmentDto: CreateAppointmentDto
	): Promise<AppointmentEntity> {
		const { categoryId, ...params } = createAppointmentDto;
		const appointment = await this.create({
			...params,
			category: { id: categoryId || 1 }
		});
		// if (this.configService.get<boolean>('TRIGGER_MAIL')) {
		// send new password to email
		await this.sendMail.add(
			'new-appointment',
			{ appointmentId: appointment.id, ...createAppointmentDto },
			{ removeOnComplete: true }
		);
		// }
		return appointment;
	}
}
