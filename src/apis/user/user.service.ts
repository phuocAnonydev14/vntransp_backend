import { PaginationDto } from '@/common/base/base.dto';
import { BaseEntity } from '@/common/base/base.entity';
import { BaseService } from '@/common/base/base.service';
import { logger, MsgIds } from '@/common/logger/logger';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { Queue } from 'bull';
import { Between, In, Repository } from 'typeorm';
import { RoleService } from '../roles/roles.service';
import { RoleEnum } from './../roles/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-role-by-userId.dto';
import { UpdateUserByIdDto } from './dto/update-user-by-id.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UserService extends BaseService<UserEntity> {
	notFoundMessage = 'User not found';

	constructor(
		@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
		@InjectQueue('user-mail') private readonly userMail: Queue,
		private readonly roleService: RoleService,
		private readonly configService: ConfigService
	) {
		super(userRepo);
	}

	async validateUserByEmailPassword(email: string, password: string): Promise<UserEntity> {
		const user = await this.getOne({
			where: { email, role: { name: RoleEnum.USER }, isActive: true }
		});
		if (!user) {
			throw new UnauthorizedException(this.notFoundMessage);
		}
		const comparePassword = await verify(user.password, password);
		if (!comparePassword) {
			throw new UnauthorizedException('Incorrect password');
		}
		return user;
	}

	async validateAdminByEmailPassword(email: string, password: string): Promise<UserEntity> {
		const user = await this.getOne({
			where: { email, role: { name: In([RoleEnum.ADMIN, RoleEnum.MODERATOR]) } }
		});
		if (!user) {
			throw new UnauthorizedException(this.notFoundMessage);
		}
		const comparePassword = await verify(user.password, password);
		if (!comparePassword) {
			throw new UnauthorizedException('Incorrect password');
		}
		return user;
	}

	async validateUserById(id: number): Promise<UserEntity> {
		return await this.getOneOrFail({
			where: {
				id
			}
		});
	}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const roleUser = await this.roleService.getOneOrFail({
				where: { name: RoleEnum.USER }
			});
			const checkEmailExist = await this.getOne({ where: { email: createUserDto.email } });
			if (checkEmailExist) {
				logger.writeWithParameter(MsgIds.E001001, createUserDto.email);
				throw new BadRequestException('Email already exists');
			}
			const user = await this.create({ ...createUserDto, role: roleUser });
			delete user.password;
			if (this.configService.get<boolean>('TRIGGER_MAIL')) {
				await this.userMail.add(
					'register',
					{ email: createUserDto.email, username: createUserDto.username },
					{ removeOnComplete: true }
				);
			}
			return user;
		} catch (error) {
			logger.writeWithError(MsgIds.E001002, error);
			throw error;
		}
	}

	async verifyEmailToken(token: string): Promise<UserEntity> {
		const user = await this.userRepo.findOne({ where: { verificationToken: token } });
		if (!user) {
			return null;
		}

		user.isActive = true;
		user.verificationToken = null; // Clear the token
		await this.userRepo.save(user);

		return user;
	}

	async getAllUserPaginated(
		query: PaginationDto<BaseEntity>
	): Promise<IPaginationResponse<UserEntity>> {
		return this.getAllPaginated(query);
	}

	async getOneUserById(id: number) {
		try {
			return await this.getOneByIdOrFail(id);
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001003, id, error);
			throw error;
		}
	}

	async removeUserById(id: number) {
		try {
			return await this.updateById(id, {
				isActive: false
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001004, id, error);
			throw error;
		}
	}

	async updateUserById(id: number, updateUserDto: UpdateUserByIdDto) {
		try {
			const { password, ...rest } = updateUserDto;
			if (password) {
				const hashedPassword = await hash(password);
				const updatedUser = { password: hashedPassword, ...rest };
				return this.updateById(id, updatedUser);
			} else {
				return this.updateById(id, updateUserDto);
			}
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001005, id, error);
			throw error;
		}
	}

	async updateUserRole(userId: number, UpdateUserRoleDto: UpdateUserRoleDto) {
		try {
			await this.roleService.getOneByIdOrFail(UpdateUserRoleDto.roleId);
			return await this.updateById(userId, {
				role: { id: UpdateUserRoleDto.roleId }
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001005, userId, error);
			throw error;
		}
	}

	async updateUserPassword(user: User, updateUserPassword: UpdateUserPasswordDto) {
		if (updateUserPassword.oldPassword === updateUserPassword.newPassword) {
			throw new BadRequestException('Old password and new password must not the same');
		}
		const userCheck = await this.getOneByIdOrFail(user.id);
		const comparePassword = await verify(userCheck.password, updateUserPassword.oldPassword);
		if (!comparePassword) {
			throw new UnauthorizedException('Incorrect password');
		}
		const hashedPassword = await hash(updateUserPassword.newPassword);
		return this.updateById(user.id, { password: hashedPassword });
	}

	async generateAndUpdateForgetPasswordToken(email: string) {
		try {
			const user = await this.userRepo.findOne({ where: { email } });
			if (!user) {
				throw new BadRequestException('User not found');
			}
			const token = Math.random().toString(36).slice(-8);
			await this.updateUserById(user.id, { password: token });
			if (this.configService.get<boolean>('TRIGGER_MAIL')) {
				// send new password to email
				await this.userMail.add(
					'forget-password',
					{ email, newPassword: token },
					{ removeOnComplete: true }
				);
			}
		} catch (error) {
			logger.writeWithParameter(MsgIds.E001008, email, error);
			throw error;
		}
	}

	async getUserCreationStats(): Promise<{ month: string; count: number }[]> {
		const now = new Date();
		const stats = [];
		const currentMonth = now.getMonth(); // 0-based index for months (0 = January, 11 = December)

		for (let i = 0; i <= currentMonth; i++) {
			const startOfMonth = new Date(now.getFullYear(), currentMonth - i, 1);
			const endOfMonth = new Date(now.getFullYear(), currentMonth - i + 1, 0);

			const monthCount = await this.userRepo.count({
				where: {
					createdAt: Between(startOfMonth, endOfMonth),
					role: { id: 3 }
				}
			});

			stats.push({
				month: startOfMonth.toLocaleString('default', { month: 'short' }),
				count: monthCount
			});
		}

		return stats.reverse();
	}
}
