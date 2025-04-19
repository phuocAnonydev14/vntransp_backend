import { ImageUploadService } from './../image-upload/image-upload.service';
import { BaseService } from '@/common/base/base.service';
import { Injectable } from '@nestjs/common';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto copy';

@Injectable()
export class CategoryService extends BaseService<Category> {
	notFoundMessage = 'Category not found';
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		private readonly imageUploadService: ImageUploadService
	) {
		super(categoryRepository);
	}

	async createCategory(createCategory: CreateCategoryDto): Promise<Category> {
		const category = await this.create(createCategory);
		if (createCategory.imageUrl) {
			await this.imageUploadService.addImageUpload({
				imageUrl: createCategory.imageUrl,
				fileKey: createCategory.fileKey,
				categoryId: category.id,
				blogId: null
			});
		}

		return category;
	}

	async getCategoryById(id: number): Promise<Category> {
		return this.getOneByIdOrFail(id, { relations: ['thumbnail'] });
	}

	async getCategoryBySlug(slug: string): Promise<Category> {
		await this.update({ where: { slug } }, { view: () => 'COALESCE(view, 0) + 1' });
		return this.getOneOrFail({ where: { slug }, relations: ['thumbnail'] });
	}

	async updateCategoryById(id: number, updateCategory: CreateCategoryDto): Promise<Category> {
		if (updateCategory.imageUrl) {
			await this.imageUploadService.addImageUpload({
				imageUrl: updateCategory.imageUrl,
				fileKey: updateCategory.fileKey,
				categoryId: id,
				blogId: null
			});
		}
		return this.updateById(id, updateCategory);
	}

	async deleteCategoryById(id: number): Promise<Category> {
		return this.removeById(id);
	}
}
