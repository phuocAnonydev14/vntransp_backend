import { MailModule } from '@/common/mail/email.module';
import { CacheModule } from '@/module/cache/cache.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		CacheModule,
		MailModule,
		BullModule.registerQueue({ name: 'user-mail' }),
		RolesModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
