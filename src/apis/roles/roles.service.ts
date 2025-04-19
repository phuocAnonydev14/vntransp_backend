import { BaseService } from '@/common/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService extends BaseService<Role> {
	notFoundMessage = 'Role not found';

	constructor(@InjectRepository(Role) private readonly userRepo: Repository<Role>) {
		super(userRepo);
	}
}
