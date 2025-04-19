import { Transform } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BlogEntity } from '../blog/blog.entity';
import { ImageType } from './imageTypes.enum';
import { BaseEntity } from '@/common/base/base.entity';
import { Category } from '../categories/categories.entity';
@Entity({ name: 'imageUpload' })
export class ImageUploadEntity extends BaseEntity {
	@Column({ type: 'text' })
	imageUrl: string;

	@Column({ nullable: true })
	type: ImageType;

	@Column()
	fileKey: string;

	@OneToOne(() => BlogEntity, (blog) => blog.thumbnail, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	@Transform(({ value }) => value?.id)
	blog: BlogEntity;

	@OneToOne(() => Category, (category) => category.thumbnail, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	@Transform(({ value }) => value?.id)
	category: Category;
}
