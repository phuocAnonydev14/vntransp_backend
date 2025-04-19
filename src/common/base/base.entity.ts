import { ApiProperty } from '@nestjs/swagger';
import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity as TypeormBaseEntity
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
	/** UUID */
	@ApiProperty({ description: 'Id' })
	@PrimaryGeneratedColumn()
	id: number;

	/** Creation Date */
	@ApiProperty({ description: 'Creation Date' })
	@CreateDateColumn()
	createdAt: Date;

	/** Last Update Time */
	@ApiProperty({ description: 'Last Update Time' })
	@CreateDateColumn()
	updatedAt: Date;

	/** Deletion Date */
	@ApiProperty({ description: 'Deletion Date' })
	@DeleteDateColumn()
	deletedAt?: Date | null;
}
