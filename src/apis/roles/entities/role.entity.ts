import { UserEntity } from '@/apis/user/entities/user.entity';
import { BaseEntity } from '@/common/base/base.entity';
import { Allow } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
	@Allow()
	@Column()
	name?: string;

	@OneToMany(() => UserEntity, (user) => user.role)
	user: UserEntity[];
}
