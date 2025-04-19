import { ApiModule } from '@/apis/api.module';
import { AppController } from '@/app.controller';
import { providers } from '@/app.provider';
import { LoggerMiddleware } from '@/common/middlewares/log.middlewares';
import { ConfigModule } from '@/module/configs/config.module';
import { DatabaseModule } from '@/module/database/database.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Bull } from './module/Bull/bull.module';
import { SeedModule } from './module/database/seeds/seed.module';
import { RateLimitModule } from './module/rateLimit/rateLimit.module';
import { TaskScheduleModule } from './module/scheduling/schedule.module';
import { JwtModule } from './module/jwt/jwt.module';
@Module({
	imports: [
		ConfigModule,
		DatabaseModule,
		ApiModule,
		Bull,
		SeedModule,
		RateLimitModule,
		TaskScheduleModule,
		JwtModule
	],
	controllers: [AppController],
	providers
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			.exclude({ path: 'v1/auth/(.*)', method: RequestMethod.ALL })
			.forRoutes('*');
	}
}
