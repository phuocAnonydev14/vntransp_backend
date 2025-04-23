import { Module } from '@nestjs/common';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './categories/categories.module';
import { RecruitmentModule } from './recruitments/recruitments.module';

@Module({
	imports: [
		AuthModule,
		CategoryModule,
		BlogModule,
		ImageUploadModule,
		AppointmentModule,
		RecruitmentModule
	]
})
export class ApiModule {}
