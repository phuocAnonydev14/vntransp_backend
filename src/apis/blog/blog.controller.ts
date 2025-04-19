import { PaginationDto } from '@/common/base/base.dto';
import {
	ApiController,
	ApiCreate,
	ApiDelete,
	ApiGetAll,
	ApiGetOne,
	ApiUpdate
} from '@/common/base/base.swagger';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	Post,
	Put,
	Query,
	UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BlogEntity } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth/auth.const';
import { RolesGuard } from '@/common/guard/role.guard';
import { RoleEnum } from '../roles/roles.enum';

@Controller('blogs')
@ApiController('Blog')
@ApiBearerAuth('access-token')
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post()
	@ApiCreate(BlogEntity, 'Blog')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN, RoleEnum.MODERATOR])
	create(@Body() createBlogDto: CreateBlogDto) {
		return this.blogService.createBlog(createBlogDto);
	}

	@Get()
	@ApiGetAll(BlogEntity, 'Blog')
	getAllPagination(@Query() query: PaginationDto) {
		return this.blogService.getAllPaginated({
			...query,
			relations: ['thumbnail'],
			order: { createdAt: 'DESC' }
		});
	}

	@Get(':slug')
	@ApiGetOne(BlogEntity, 'Blog')
	getOne(@Param('slug') slug: string, @Query('view', ParseBoolPipe) view: boolean) {
		if (view) {
			this.blogService.increaseView(slug);
		}
		return this.blogService.getOneOrFail({
			where: { slug },
			relations: ['thumbnail']
		});
	}

	@Put(':id')
	@ApiUpdate(BlogEntity, 'Blog')
	// @UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	// @Roles([RoleEnum.ADMIN, RoleEnum.MODERATOR])
	update(@Param('id') id: number, @Body() updateDto: UpdateBlogDto) {
		return this.blogService.updateById(id, updateDto);
	}

	@Delete(':id')
	@ApiDelete(BlogEntity, 'Blog')
	// @UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	// @Roles([RoleEnum.ADMIN, RoleEnum.MODERATOR])
	delete(@Param('id') id: number) {
		return this.blogService.removeById(id);
	}
}
