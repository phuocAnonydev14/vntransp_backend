import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadEntity } from './image-upload.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ImageUploadEntity])],
	providers: [ImageUploadService],
	controllers: [ImageUploadController],
	exports: [ImageUploadService]
})
export class ImageUploadModule {}
