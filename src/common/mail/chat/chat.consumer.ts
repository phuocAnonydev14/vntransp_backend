import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatMailService } from './chatMail.service';

@Processor('chat-mail')
export class ChatConsumer {
	constructor(private readonly chatMailService: ChatMailService) {}

	@Process('chat-notify-anonymous-user')
	async newNotiChat(job: Job<unknown>) {
		console.log('🚀 ~ EmailConsumer ~ newSubscription ~ job:', job.data);
		const time1 = new Date().getTime();
		await this.chatMailService.sendMailNewNotiChat(job.data['email'], job.data['name']);
		const time2 = new Date().getTime();
		console.log('🚀 ~ EmailConsumer ~ newSubscription ~ time', time2 - time1);
		console.log('Email sent');
	}

	@Process('unanswered-message')
	async unansweredMessage(job: Job<unknown>) {
		console.log('🚀 ~ EmailConsumer ~ unansweredMessage ~ job:', job.data);
		const time1 = new Date().getTime();
		await this.chatMailService.sendMailUnansweredMessage(job.data['name'], job.data['message']);
		const time2 = new Date().getTime();
		console.log('🚀 ~ EmailConsumer ~ unansweredMessage ~ time', time2 - time1);
		console.log('Email sent');
	}
}
