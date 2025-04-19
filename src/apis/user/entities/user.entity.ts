import { Role } from '@/apis/roles/entities/role.entity';
import { BaseEntity } from '@/common/base/base.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
	/** Login account */
	@Column()
	username: string;

	@Column({ unique: true })
	@IsEmail()
	email: string;

	/** Password */
	@ApiHideProperty()
	@Column()
	@Exclude()
	password: string;

	/**
	 * Hash the password before saving the user to the database
	 */
	@BeforeInsert()
	async beforeInsert() {
		this.password = await hash(this.password);
	}

	/**
	 * Activation status of the user
	 */
	@Column({ default: true })
	@Exclude()
	isActive: boolean;

	@Column({ nullable: true })
	@Exclude()
	verificationToken: string;

	/**
	 * Role of the user
	 */
	@ManyToOne(() => Role, (role) => role.user, { eager: true })
	role: Role;
}
