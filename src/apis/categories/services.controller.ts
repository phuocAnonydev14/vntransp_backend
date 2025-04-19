import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto copy';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';
import { ApiCreate, ApiGetAll, ApiGetOne, ApiUpdate } from '@/common/base/base.swagger';
import { AuthGuard } from '@nestjs/passport';
import { ICacheService } from '@/module/cache/cache.interface';
import { PaginationDto } from '@/common/base/base.dto';
import { timeExpire } from '@/common/constant/timeExpire';
import { CategoryService } from './categories.service';
import { Roles } from '../roles/roles.decorator';
import { AuthStrategy } from '../auth/auth.const';
import { RolesGuard } from '@/common/guard/role.guard';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller({
	path: 'categories',
	version: '1'
})
export class CategoryController {
	private readonly cacheKey = 'category';

	constructor(
		private readonly categoryService: CategoryService,
		private readonly cacheService: ICacheService
	) {}

	@Post()
	@ApiCreate(Category, 'Category')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN])
	create(@Body() createCategoryDto: CreateCategoryDto) {
		const createdCategory = this.categoryService.createCategory(createCategoryDto);
		this.removeCacheData();
		return createdCategory;
	}

	@Get()
	@ApiGetAll(Category, 'Category')
	async findAll(@Query() query: PaginationDto) {
		const cachedData = await this.cacheService.get(this.cacheKey);
		// if (cachedData) {
		// 	return JSON.parse(cachedData);
		// } else {
		const category = await this.categoryService.getAllPaginated({
			...query,
			relations: ['thumbnail'],
			order: { createdAt: 'DESC' }
		});
		this.cacheService.set(this.cacheKey, JSON.stringify(category), timeExpire.SHORT_TIME);
		return category;
		// }
	}

	@Get(':slug')
	@ApiGetOne(Category, 'Category')
	findOne(@Param('slug') slug: string) {
		return this.categoryService.getCategoryBySlug(slug);
	}

	@Put(':id')
	@ApiUpdate(Category, 'Category')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles('Admin')
	updateCategoryById(@Param('id') id: number, @Body() updateCategoryDto: CreateCategoryDto) {
		const updatedCategory = this.categoryService.updateCategoryById(id, updateCategoryDto);
		this.removeCacheData();
		return updatedCategory;
	}

	@Delete(':id')
	@UseGuards(AuthGuard(AuthStrategy.USER_JWT), RolesGuard)
	@Roles([RoleEnum.ADMIN, RoleEnum.MODERATOR])
	removeCategoryById(@Param('id') id: number) {
		const deletedCategory = this.categoryService.deleteCategoryById(id);
		this.removeCacheData();
		return deletedCategory;
	}

	private removeCacheData() {
		this.cacheService.del(this.cacheKey);
	}
}
