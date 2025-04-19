import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CategoryController } from './services.controller';
import { CacheModule } from '@/module/cache/cache.module';
import { CategoryService } from './categories.service';
import { ImageUploadModule } from '../image-upload/image-upload.module';

@Module({
	imports: [TypeOrmModule.forFeature([Category]), CacheModule, ImageUploadModule],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService]
})
export class CategoryModule {}
