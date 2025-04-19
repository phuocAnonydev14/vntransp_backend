import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../configs/config.module';
@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				redis: {
					host: config.get<string>('REDIS_HOST'),
					port: config.get<number>('REDIS_PORT'),
					db: config.get<number>('REDIS_DB'),
					password: config.get<string>('REDIS_PASSWORD'),
					keyPrefix: config.get<string>('REDIS_PREFIX')
				}
			}),
			inject: [ConfigService]
		})
	],
	providers: [],
	exports: []
})
export class Bull {}
