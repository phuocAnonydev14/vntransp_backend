// import { ImageUploadEntity } from "@/apis/image-upload/entity/imageUpload.entity";
import { BaseEntity } from '@/common/base/base.entity';
import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import { ImageUploadEntity } from '../image-upload/image-upload.entity';

@Entity({ name: 'blog' })
export class BlogEntity extends BaseEntity {
	@Column()
	title: string;

	@Column({ type: 'text', nullable: true })
	desc: string;

	@Column({ type: 'text' })
	content: string;

	@Column()
	slug: string;

	@Column({ type: 'int4', default: 0 })
	view: number;

	@OneToOne(() => ImageUploadEntity, (image) => image.blog, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	thumbnail: ImageUploadEntity;

	@Column({ type: 'text', default: 'internal' })
	tag: string; // internal | external;

	@Column({ type: 'boolean', default: true })
	draft: boolean;
	@BeforeInsert()
	beforeInsert() {
		if (this.title) {
			this.slug = this.convertToSlug(this.title);
		} else {
			this.slug = '';
		}
	}

	private convertToSlug(text: string): string {
		if (!text) return '';
		const from =
			'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûüÿýỳỷỹỵÀÁÃẢẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆĐÙÚỦŨỤƯỪỨỬỮỰÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÌÍỈĨỊÄËÏÎÖÜÛÜŸÝỲỶỸỴ';
		const to =
			'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuoooooooooooooooooiiiiiiiaeiiouuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDUUUUUUUUUUOOOOOOOOOOOOOOOOIIIIIIAEOIOUUYyyyy';
		let slug = text.replace(/[^A-Za-z0-9 -]/g, function (char) {
			const index = from.indexOf(char);
			if (index >= 0) {
				return to[index];
			}
			return '';
		});
		slug = slug
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '');
		return slug;
	}
}
