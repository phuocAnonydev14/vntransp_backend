import { logger, MsgIds } from '@/common/logger/logger';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderMailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendMailNewOrder(email: string, username: string, orderId: number) {
		try {
			await this.mailerService.sendMail({
				from: 'TieMen New Order',
				to: this.configService.get<string>('MAIL_USER'),
				subject: `New Order Alert: Order #${orderId} Placed by ${username}`,
				text: `Hello Admin, A new order #${orderId} has been placed by ${username}. Please review the order details as soon as possible.`,
				template: './newOrder',
				context: {
					username,
					orderId
				}
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001009, { email, username, orderId }, error);
		}
	}
}
