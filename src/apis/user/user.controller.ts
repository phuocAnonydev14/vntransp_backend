import { RoleEnum } from '@/apis/roles/roles.enum';
import { PaginationDto } from '@/common/base/base.dto';
import {
	ApiController,
	ApiCreate,
	ApiDelete,
	ApiGetAll,
	ApiGetOne,
	ApiUpdate
} from '@/common/base/base.swagger';
import { Roles } from './../roles/roles.decorator';
import { UpdateUserRoleDto } from './dto/update-role-by-userId.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

import { User } from '@/common/decorator/user.decorator';
import { RolesGuard } from '@/common/guard/role.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthStrategy } from '../auth/auth.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiController('User')
@ApiBearerAuth('access-token')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiCreate(UserEntity, 'User')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}

	@Get()
	@ApiGetAll(UserEntity, 'User')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN, RoleEnum.MODERATOR])
	getAll(@Query() query: PaginationDto) {
		return this.userService.getAllPaginated(query);
	}

	@Get(':id')
	@ApiGetOne(UserEntity, 'User')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT))
	getOne(@Param('id') id: number) {
		return this.userService.getOneUserById(id);
	}

	@Put('/change-role/:id')
	@ApiUpdate(UserEntity, 'User Role')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN])
	updateRole(@Param('id') id: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
		return this.userService.updateUserRole(id, updateUserRoleDto);
	}

	@Put('/change-password')
	@ApiUpdate(UserEntity, 'User Password')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT))
	updatePassword(@User() user, @Body() updateUserPassword: UpdateUserPasswordDto) {
		return this.userService.updateUserPassword(user, updateUserPassword);
	}

	@Delete(':id')
	@ApiDelete(UserEntity, 'User')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN])
	remove(@Param('id') id: number) {
		return this.userService.removeUserById(id);
	}
}
