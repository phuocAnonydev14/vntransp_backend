import { BaseEntity } from '@/common/base/base.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ImageUploadEntity } from '../image-upload/image-upload.entity';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';

@Entity({
	name: 'category'
})
export class Category extends BaseEntity {
	@Column({ type: String, default: '' })
	name: string;

	@Column({ type: String, default: '' })
	description: string;

	@Column({ type: String, default: '', unique: true })
	slug: string;

	@Column({ type: String, default: '' })
	content: string;

	@Column({ type: 'bigint', default: 0 })
	view: number;

	@OneToOne(() => ImageUploadEntity, (image) => image.category)
	thumbnail: ImageUploadEntity;

	@OneToMany(() => AppointmentEntity, (appointment) => appointment.category, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	appointments: AppointmentEntity[];

	@BeforeInsert()
	beforeInsert() {
		if (this.name) {
			this.slug = this.convertToSlug(this.name);
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
