import { logger, MsgIds } from '@/common/logger/logger';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatMailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendMailNewNotiChat(email: string, name: string) {
		try {
			await this.mailerService.sendMail({
				from: email,
				to: this.configService.get<string>('MAIL_USER'),
				subject: `Message from user`,
				template: './newNotiChat',
				context: {
					name,
					email
				}
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001011, { email }, error);
		}
	}

	async sendMailUnansweredMessage(name: string, message: string) {
		try {
			await this.mailerService.sendMail({
				from: 'TieMen Customer Support',
				to: this.configService.get<string>('MAIL_USER'),
				subject: `${name} send message to you`,
				template: './unansweredMessage',
				context: {
					name,
					message
				}
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001012, { name, message }, error);
		}
	}
}
