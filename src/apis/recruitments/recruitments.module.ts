import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentEntity } from './recruitment.entity';
import { MailModule } from '@/common/mail/email.module';
import { BullModule } from '@nestjs/bull';
import { RecruitmentController } from './recruitments.controller';
import { RecruitmentService } from './recruitments.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([RecruitmentEntity]),
		MailModule,
		BullModule.registerQueue({ name: 'subscribe-mail' })
	],
	controllers: [RecruitmentController],
	providers: [RecruitmentService],
	exports: []
})
export class RecruitmentModule {}
