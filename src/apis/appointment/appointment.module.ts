import { MailModule } from '@/common/mail/email.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentEntity } from './entities/appointment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([AppointmentEntity]),
		MailModule,
		BullModule.registerQueue({ name: 'subscribe-mail' })
	],
	controllers: [AppointmentController],
	providers: [AppointmentService]
})
export class AppointmentModule {}
