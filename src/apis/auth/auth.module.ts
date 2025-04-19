import { CacheModule } from '@/module/cache/cache.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthValidationMiddleware } from './../../common/middlewares/auth.validation.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/jwt/refresh-jwt.strategy';
import { AdminLocalStrategy } from './strategies/local/admin.local.strategy';
import { UserLocalStrategy } from './strategies/local/user.local.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
	imports: [PassportModule, UserModule, CacheModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService, UserLocalStrategy, JwtStrategy, RefreshJwtStrategy, AdminLocalStrategy]
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthValidationMiddleware)
			.forRoutes({ path: '/v1/auth/user/login', method: RequestMethod.POST });
	}
}
