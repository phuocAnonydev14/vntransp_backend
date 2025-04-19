import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { CreateUserDto } from './../src/apis/user/dto/create-user.dto';
import { AppController } from './../src/app.controller';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('App', () => {
	let app: INestApplication;
	let authTokenAdmin: string;
	let authTokenUser: string;
	const userCreated: CreateUserDto = {
		email: faker.internet.email(),
		password: faker.internet.password(),
		username: faker.internet.username()
	};
	let userId: number;

	beforeAll(async () => {
		initializeTransactionalContext();
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		})
			.overrideProvider(AppController)
			.useValue(AppService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();

		await request(app.getHttpServer())
			.post('/user')
			.send(userCreated)
			.expect(201)
			.expect((res) => {
				userId = res.body.data.id;
				expect(res.body.data.email).toBe(userCreated.email);
			});
		const loginNormalUserResponse = await request(app.getHttpServer())
			.post('/auth/user/login')
			.send({
				email: userCreated.email,
				password: userCreated.password
			});
		authTokenUser = loginNormalUserResponse.body.data.accessToken;
		// Login as admin to get token
		const loginAdminResponse = await request(app.getHttpServer())
			.post('/auth/user/login/admin')
			.send({
				email: 'admin@example.com',
				password: 'string'
			});
		authTokenAdmin = loginAdminResponse.body.data.accessToken;
	});

	describe('POST /user', () => {
		it('should create new user', async () => {
			const newUser: CreateUserDto = {
				email: faker.internet.email(),
				password: faker.internet.password(),
				username: faker.internet.username()
			};
			return request(app.getHttpServer())
				.post('/user')
				.send(newUser)
				.expect(201)
				.expect((res) => {
					expect(res.body.data.email).toBe(newUser.email);
				});
		});

		it('should not create new user with existing email', async () => {
			return request(app.getHttpServer())
				.post('/user')
				.send(userCreated)
				.expect(400)
				.expect((res) => {
					expect(res.body.message).toBe('Email already exists');
				});
		});
	});

	describe('GET /user', () => {
		it('should get all users with pagination', () => {
			return request(app.getHttpServer())
				.get('/user')
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.query({ page: 1, limit: 10 })
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toBeDefined();
					expect(Array.isArray(res.body.data)).toBeTruthy();
				});
		});

		it('should not get all users with pagination without permission', () => {
			return request(app.getHttpServer())
				.get('/user')
				.query({ page: 1, limit: 10 })
				.expect(401)
				.expect((res) => {
					expect(res.body.message).toBe('Unauthorized');
				});
		});

		it('should not get all users with invalid pagination', () => {
			return request(app.getHttpServer())
				.get('/user')
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.query({ page: -1, limit: -10 })
				.expect(422)
				.expect((res) => {
					expect(res.body.message).toBe('LIMIT must not be negative');
				});
		});

		it('should not get all users with invalid pagination', () => {
			return request(app.getHttpServer())
				.get('/user')
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.query({ page: 'a', limit: 'b' })
				.expect(500);
		});

		it('should not get all users with user permission', () => {
			return request(app.getHttpServer())
				.get('/user')
				.set('Authorization', `Bearer ${authTokenUser}`)
				.query({ page: 1, limit: 0 })
				.expect(403)
				.expect((res) => {
					expect(res.body.message).toBe(
						'You do not have permission to perform this action'
					);
				});
		});

		it('should get one user by id', () => {
			return request(app.getHttpServer())
				.get(`/user/${userId}`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.expect(200);
		});

		it('should not get one user by id without permission', () => {
			return request(app.getHttpServer())
				.get(`/user/${userId}`)
				.expect(401)
				.expect((res) => {
					expect(res.body.message).toBe('Unauthorized');
				});
		});

		it('should not get one user by id with invalid id', () => {
			return request(app.getHttpServer())
				.get(`/user/0`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.expect(404)
				.expect((res) => {
					expect(res.body.message).toBe('User not found');
				});
		});
	});

	describe('Put /user/change-role/:id', () => {
		it('should change user role', () => {
			return request(app.getHttpServer())
				.put(`/user/change-role/${userId}`)
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.send({ roleId: 2 })
				.expect(200);
		});

		it('should not change user role without permission', () => {
			return request(app.getHttpServer())
				.put(`/user/change-role/${userId}`)
				.send({ roleId: 1 })
				.expect(401)
				.expect((res) => {
					expect(res.body.message).toBe('Unauthorized');
				});
		});

		it('should not change user role with invalid id', () => {
			return request(app.getHttpServer())
				.put(`/user/change-role/0`)
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.send({ roleId: 1 })
				.expect(404)
				.expect((res) => {
					expect(res.body.message).toBe('User not found');
				});
		});

		it('should not change user role with user permission', () => {
			return request(app.getHttpServer())
				.put(`/user/change-role/${userId}`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.send({ roleId: 1 })
				.expect(403)
				.expect((res) => {
					expect(res.body.message).toBe(
						'You do not have permission to perform this action'
					);
				});
		});

		it('should not change user role with invalid role', () => {
			return request(app.getHttpServer())
				.put(`/user/change-role/${userId}`)
				.set('Authorization', `Bearer ${authTokenAdmin}`)
				.send({ roleId: 100 })
				.expect(404)
				.expect((res) => {
					expect(res.body.message).toBe('Role not found');
				});
		});

		it('should change password of user', async () => {
			return request(app.getHttpServer())
				.put(`/user/change-password`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.send({ oldPassword: userCreated.password, newPassword: faker.internet.password() })
				.expect(200);
		});

		it('should not change password of user when old password is incorrect', async () => {
			return request(app.getHttpServer())
				.put(`/user/change-password`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.send({
					oldPassword: faker.internet.password(),
					newPassword: faker.internet.password()
				})
				.expect(401)
				.expect((res) => {
					expect(res.body.message).toBe('Incorrect password');
				});
		});

		it('should not change password of user when old password and new password are same', async () => {
			const password = faker.internet.password();
			return request(app.getHttpServer())
				.put(`/user/change-password`)
				.set('Authorization', `Bearer ${authTokenUser}`)
				.send({
					oldPassword: password,
					newPassword: password
				})
				.expect(400)
				.expect((res) => {
					expect(res.body.message).toBe(
						'Old password and new password must not the same'
					);
				});
		});

		it('should not change password of user without permission', () => {
			return request(app.getHttpServer())
				.put(`/user/change-password`)
				.send({ oldPassword: userCreated.password, newPassword: faker.internet.password() })
				.expect(401)
				.expect((res) => {
					expect(res.body.message).toBe('Unauthorized');
				});
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
