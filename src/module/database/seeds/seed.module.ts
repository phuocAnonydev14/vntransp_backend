import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database.module';
import { SeedService } from './seed.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env']
		}),
		DatabaseModule
	],
	providers: [SeedService]
})
export class SeedModule {}
