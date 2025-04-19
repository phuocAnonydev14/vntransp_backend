import { BaseService } from '@/common/base/base.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { join } from 'path';
import { Repository } from 'typeorm';
import { ImageUploadEntity } from './image-upload.entity';
@Injectable()
export class ImageUploadService extends BaseService<ImageUploadEntity> {
	notFoundMessage = 'Image not found';
	private readonly uploadPath = join(process.cwd(), 'uploads/images');
	constructor(
		@InjectRepository(ImageUploadEntity)
		private readonly imageUploadRepository: Repository<ImageUploadEntity>,
		@Inject(REQUEST) private readonly request: Request
	) {
		super(imageUploadRepository);
	}

	async addImageUpload(params: {
		imageUrl: string;
		fileKey: string;
		categoryId?: number;
		blogId?: number;
	}) {
		if (!params.blogId && !params.categoryId) {
			throw new BadRequestException('CategoryId or BlogId is required');
		}
		const { imageUrl, fileKey, categoryId, blogId } = params;
		const existedImageUpload = await this.getOne({ where: { fileKey } });
		if (existedImageUpload) {
			return;
		}
		const imageUpload = await this.create({
			imageUrl,
			fileKey,
			blog: { id: blogId || null },
			category: { id: categoryId || null }
		});
		return imageUpload;
	}
}
