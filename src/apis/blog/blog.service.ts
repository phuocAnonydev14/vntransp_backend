import { BaseService } from '@/common/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogEntity } from './blog.entity';
import { ImageUploadService } from '../image-upload/image-upload.service';

@Injectable()
export class BlogService extends BaseService<BlogEntity> {
	notFoundMessage: string = 'Blog not found';
	constructor(
		@InjectRepository(BlogEntity)
		private readonly blogRepo: Repository<BlogEntity>,
		private readonly imageUploadService: ImageUploadService
	) {
		super(blogRepo);
	}
	async createBlog(createBlogDto: CreateBlogDto) {
		const blog = await this.create(createBlogDto);
		if (createBlogDto.imageUrl) {
			await this.imageUploadService.addImageUpload({
				imageUrl: createBlogDto.imageUrl,
				fileKey: createBlogDto.fileKey,
				categoryId: null,
				blogId: blog.id
			});
		}
		return blog;
	}

	increaseView(slug: string) {
		return this.update({ where: { slug } }, { view: () => 'view + 1' });
	}

	getBlogById(id: number) {
		return this.getOneByIdOrFail(id);
	}

	async updateBlogById(id: number, updateBlogDto: CreateBlogDto) {
		if (updateBlogDto.imageUrl) {
			await this.imageUploadService.addImageUpload({
				imageUrl: updateBlogDto.imageUrl,
				fileKey: updateBlogDto.fileKey,
				categoryId: null,
				blogId: id
			});
		}
		return this.updateById(id, updateBlogDto);
	}

	deleteBlogById(id: number) {
		return this.removeById(id);
	}
}
