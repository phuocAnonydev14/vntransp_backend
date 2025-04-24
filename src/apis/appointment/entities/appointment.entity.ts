import { Category } from '@/apis/categories/categories.entity';
import { BaseEntity } from '@/common/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'appointment' })
export class AppointmentEntity extends BaseEntity {
	@Column({ type: 'varchar', length: 50, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	email: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	phone: string;

	@Column({ nullable: true })
	message: string;

	@ManyToOne(() => Category, (category) => category.appointments, { eager: true, nullable: true })
	category: Category;
}
