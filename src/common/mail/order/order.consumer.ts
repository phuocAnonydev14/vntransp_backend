import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderMailService } from './orderMail.service';

@Processor('order-mail')
export class OrderConsumer {
	constructor(private readonly orderMailService: OrderMailService) {}

	@Process('new-order')
	async newOrder(job: Job<unknown>) {
		console.log('🚀 ~ EmailConsumer ~ newOrder ~ job:', job.data);
		const time1 = new Date().getTime();
		await this.orderMailService.sendMailNewOrder(
			job.data['email'],
			job.data['username'],
			job.data['orderId']
		);
		const time2 = new Date().getTime();
		console.log('🚀 ~ EmailConsumer ~ newOrder ~ time', time2 - time1);
		console.log('Email sent');
	}
}
