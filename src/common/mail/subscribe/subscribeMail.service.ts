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
		message: string,
		phone: string,
	) {
		try {
			await this.mailerService.sendMail({
				from: 'Vntransp New Appointment',
				to: process.env.MAIL_USER,
				subject: `New Appointment Alert: Appointment #${appointmentId} Booked by ${name}`,
				template: './newAppointment',
				context: {
					appointmentId,
					name,
					email,
					message,
					phone
				}
			});
		} catch (error) {
			logger.writeWithParameter(
				MsgIds.E001010,
				{ appointmentId, name, email, message },
				error
			);
		}
	}

	async sendMailNewSubscription(email: string) {
		try {
			await this.mailerService.sendMail({
				from: 'Vntransp News',
				to: email,
				subject: `Thank you for subscribing to Vntransp Newsletter`,
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
