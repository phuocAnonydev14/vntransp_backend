import { PaginationDto } from '@/common/base/base.dto';
import {
	ApiController,
	ApiCreate,
	ApiDelete,
	ApiGetAll,
	ApiGetOne
} from '@/common/base/base.swagger';
import { RolesGuard } from '@/common/guard/role.guard';
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadEntity } from './image-upload.entity';

@Controller('image-upload')
@ApiController('Image Upload')
@ApiBearerAuth('access-token')
export class ImageUploadController {
	constructor(private readonly imageUploadService: ImageUploadService) {}

	@Delete(':key')
	@ApiDelete(ImageUploadEntity, 'Image Upload')
	async deleteImageUpload(@Param('key') key: string) {
		const imageUpload = await this.imageUploadService.getOneOrFail({ where: { fileKey: key } });
		if (!imageUpload) {
			throw new BadRequestException('Image upload not found');
		}
		await this.imageUploadService.remove({ where: { fileKey: key } });
		return { message: 'Image upload deleted successfully' };
	}

	@Post('')
	async addImageUpload(
		@Body() body: { imageUrl: string; fileKey: string; categoryId?: number; blogId?: number }
	) {
		const imageUpload = await this.imageUploadService.addImageUpload(body);
		return imageUpload;
	}
}
