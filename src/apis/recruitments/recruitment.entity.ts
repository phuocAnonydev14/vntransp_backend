import { BaseEntity } from '@/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'recruitment' })
export class RecruitmentEntity extends BaseEntity {
	@Column({ type: 'varchar', length: 50, nullable: false })
	title: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	location: string;

	@Column({ type: 'varchar', length: 50, default: 'fulltime' })
	type: string; // fulltime or part-time

	@Column({ nullable: true })
	salary: number;

	@Column({ type: 'text', nullable: false })
	description: string;

	@Column({ type: 'simple-array', nullable: false })
	requirements: string[];

	@Column({ type: 'simple-array', nullable: false })
	benefits: string[];

	@Column({ type: 'date' })
	deadline: string;
}
