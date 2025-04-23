import { BaseService } from '@/common/base/base.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { RecruitmentEntity } from './recruitment.entity';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';

@Injectable()
export class RecruitmentService extends BaseService<RecruitmentEntity> {
	notFoundMessage: string = 'Recruitment not found';
	constructor(
		@InjectRepository(RecruitmentEntity)
		private readonly recruitmentRepo: Repository<RecruitmentEntity>,
		@InjectQueue('subscribe-mail') private readonly sendMail: Queue,
		private readonly configService: ConfigService
	) {
		super(recruitmentRepo);
	}

	async createRecruitment(
		createRecruitmentDto: CreateRecruitmentDto
	): Promise<RecruitmentEntity> {
		const recruitment = await this.create({ ...createRecruitmentDto });
		if (this.configService.get<boolean>('TRIGGER_MAIL')) {
			// send new password to email
			await this.sendMail.add(
				'new-recruitment',
				{ recruitmentId: recruitment.id, ...createRecruitmentDto },
				{ removeOnComplete: true }
			);
		}
		return recruitment;
	}
}
