import { AppointmentService } from '@/apis/appointment/appointment.service';
import { ConfigModule } from '@/module/configs/config.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscribeConsumer } from './subscribe/subscribe.consumer';
import { SubscribeMailService } from './subscribe/subscribeMail.service';
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get<string>('MAIL_HOST'),
					secure: false,
					auth: {
						user: config.get<string>('MAIL_USER'),
						pass: config.get<string>('MAIL_PASS')
					}
				},
				template: {
					dir: __dirname + '/templates/',
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true
					}
				}
			}),
			inject: [ConfigService]
		})
	],
	providers: [SubscribeConsumer, SubscribeMailService],
	exports: [SubscribeMailService]
})
export class MailModule {}
