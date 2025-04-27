import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SubscribeMailService } from './subscribeMail.service';

@Processor('subscribe-mail')
export class SubscribeConsumer {
	constructor(private readonly subscribeMailService: SubscribeMailService) {}

	@Process('new-appointment')
	async newAppointment(job: Job<unknown>) {
		console.log('🚀 ~ EmailConsumer ~ newAppointment ~ job:', job.data);
		const time1 = new Date().getTime();
		await this.subscribeMailService.sendMailNewAppointment(
			job.data['id'],
			job.data['name'],
			job.data['email'],
			job.data['message'],
			job.data['phone'],
		);
		const time2 = new Date().getTime();
		console.log('🚀 ~ EmailConsumer ~ newAppointment ~ time', time2 - time1);
		console.log('Email sent');
	}

	@Process('new-subscription')
	async newSubscription(job: Job<unknown>) {
		console.log('🚀 ~ EmailConsumer ~ newSubscription ~ job:', job.data);
		const time1 = new Date().getTime();
		await this.subscribeMailService.sendMailNewSubscription(job.data['email']);
		const time2 = new Date().getTime();
		console.log('🚀 ~ EmailConsumer ~ newSubscription ~ time', time2 - time1);
		console.log('Email sent');
	}
}
