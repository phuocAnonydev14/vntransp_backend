import { AppModule } from '@/app.module';
import { MsgIds, logger } from '@/common/logger/logger';
import { setupSwagger } from '@/common/swagger';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { SeedService } from './module/database/seeds/seed.service';

async function bootstrap() {
	initializeTransactionalContext();
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const seedService = app.get(SeedService);
	await seedService.seed();
	app.useGlobalPipes(new CustomValidationPipe());
	const configService = app.get<ConfigService>(ConfigService);
	const port = configService.get<string>('PORT') || 3000;
	const nodeEnv = configService.get<string>('NODE_ENV');
	const corsOriginAdmin = configService.get<string>('CORS_ORIGIN_ADMIN');
	const corsOriginClient = configService.get<string>('CORS_ORIGIN_CLIENT');
	app.use(cookieParser());
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					imgSrc: ["'self'", 'data:', 'blob:', '*'],
					scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
				}
			}
		})
	);
	app.use(compression());
	app.enableCors({
		origin: (origin, callback) => {
			const allowedOrigins = [corsOriginAdmin, corsOriginClient];
			callback(null, true);
			if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'), false);
			}
		},
		methods: 'GET, POST, PUT, DELETE, PATCH',
		allowedHeaders: 'Content-Type, Authorization',
		credentials: true
	});

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1'
	});

	setupSwagger(app);
	app.useStaticAssets(join(process.cwd(), 'uploads'), {
		prefix: '/uploads/'
	});
	await app.listen(port).then(async () => {
		const url = await app.getUrl();
		const parameters = {
			port,
			environment: nodeEnv,
			documentation: `${url}/api/docs`
		};
		logger.writeWithParameter(MsgIds.M002001, parameters);
	});
}

bootstrap();
