import { logger, MsgIds } from '@/common/logger/logger';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscribeMailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendMailNewAppointment(
		appointmentId: number,
		name: string,
		email: string,
		date: Date,
		time: string,
		location: string,
		message: string
	) {
		try {
			await this.mailerService.sendMail({
				from: 'TieMen New Appointment',
				to: process.env.MAIL_USER,
				subject: `New Appointment Alert: Appointment #${appointmentId} Booked by ${name}`,
				template: './newAppointment',
				context: {
					appointmentId,
					name,
					email,
					date,
					time,
					location,
					message
				}
			});
		} catch (error) {
			logger.writeWithParameter(
				MsgIds.E001010,
				{ appointmentId, name, email, date, time, location, message },
				error
			);
		}
	}

	async sendMailNewSubscription(email: string) {
		try {
			await this.mailerService.sendMail({
				from: 'TieMen News',
				to: email,
				subject: `Thank you for subscribing to TieMen Newsletter`,
				template: './newSubscription',
				context: {
					email
				}
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001011, { email }, error);
		}
	}
}
