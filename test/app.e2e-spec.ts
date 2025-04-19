import { AppController } from './../src/app.controller';
import { Test } from '@nestjs/testing';
import { AppService } from './../src/app.service';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigModule } from '../src/module/configs/config.module';
import { DatabaseModule } from '../src/module/database/database.module';

describe('App', () => {
	let app: INestApplication;

	beforeAll(async () => {
		initializeTransactionalContext();
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, ConfigModule, DatabaseModule]
		})
			.overrideProvider(AppController)
			.useValue(AppService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it(`/GET `, () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect({ status: 200, message: 'success', data: 'nest-demo v0.0.1' });
	});

	afterAll(async () => {
		await app.close();
	});
});
