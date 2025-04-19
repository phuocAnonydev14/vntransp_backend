import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleService } from './roles.service';

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	providers: [RoleService],
	exports: [RoleService]
})
export class RolesModule {}
