import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { ImageUploadModule } from '../image-upload/image-upload.module';

@Module({
	imports: [TypeOrmModule.forFeature([BlogEntity]), ImageUploadModule],
	controllers: [BlogController],
	providers: [BlogService],
	exports: [BlogService]
})
export class BlogModule {}
