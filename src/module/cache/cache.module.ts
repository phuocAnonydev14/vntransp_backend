import { MetadataKey } from '@/common/constant/constants';
import { logger, MsgIds } from '@/common/logger/logger';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICacheService } from './cache.interface';
import { CacheService } from './cache.service';

@Global()
@Module({
	providers: [
		{
			provide: MetadataKey.REDIS,
			useFactory(config: ConfigService) {
				try {
					return new Redis({
						port: config.get<number>('REDIS_PORT'),
						host: config.get<string>('REDIS_HOST'),
						db: config.get<number>('REDIS_DB'),
						password: config.get<string>('REDIS_PASSWORD'),
						keyPrefix: config.get<string>('REDIS_PREFIX')
					});
				} catch (error) {
					logger.writeWithError(MsgIds.E003001, error);
				}
			},
			inject: [ConfigService]
		},
		{
			provide: ICacheService,
			useClass: CacheService
		}
	],
	exports: [ICacheService]
})
export class CacheModule {}
