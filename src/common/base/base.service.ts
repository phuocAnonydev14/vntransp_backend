import { AbstractBaseService } from '@/common/base/base.abstract';
import { BaseEntity } from '@/common/base/base.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { extend } from 'lodash';
import {
	DeepPartial,
	DeleteResult,
	FindOptionsWhere,
	Like,
	Repository,
	UpdateResult
} from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { logger, MsgIds } from '../logger/logger';

export abstract class BaseService<T extends BaseEntity> extends AbstractBaseService<T> {
	abstract notFoundMessage: string;

	constructor(private readonly repository: Repository<T>) {
		super();
	}

	@Transactional()
	create(data: DeepPartial<T>): Promise<T> {
		try {
			data.createdAt = new Date();
			data.updatedAt = new Date();
			return this.repository.create(data).save();
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002001, { notFoundMessage: this.notFoundMessage.split(' ')[0], data }, error);
			throw error;
		}
	}

	@Transactional()
	async createMany(datas: DeepPartial<T>[]): Promise<T[]> {
		const entities: T[] = [];
		for (const data of datas) {
			try {
				const entity = await this.create(data);
				entities.push(entity);
			} catch (error) {
				logger.writeWithParameter(MsgIds.E002001, { notFoundMessage: this.notFoundMessage.split(' ')[0], data }, error);
				throw error;
			}
		}
		return entities;
	}

	async getOne(options: FindOptions<T>): Promise<T | null> {
		try {
			const { relations, loadEagerRelations, order, withDeleted, select, where } = options;
			return await this.repository.findOne({ where, relations, loadEagerRelations, order, withDeleted, select });
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002002, { options, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
			throw error;
		}
	}

	async getOneOrFail(options: FindOrFailOptions<T>): Promise<T> {
		const errorMessage = options?.errorMessage || this.notFoundMessage;
		const where = options.where;
		const entity = await this.getOne({ ...options, where });
		if (!entity) throw new NotFoundException(errorMessage);
		return entity;
	}

	async getOneById(id: number, options?: Partial<FindOptions<T>>): Promise<T | null> {
		const where = { id } as FindOptionsWhere<T>;
		return await this.getOne({ ...options, where });
	}

	async getOneByIdOrFail(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T> {
		const errorMessage = options?.errorMessage || this.notFoundMessage;
		const entity = await this.getOneById(id, options);
		if (!entity) {
			logger.writeWithParameter(MsgIds.E002002, { id, options, notFoundMessage: this.notFoundMessage.split(' ')[0] })
			throw new NotFoundException(errorMessage);
		}
		return entity;
	}

	async getOneOrCreate(options: FindOptions<T>, data?: DeepPartial<T>): Promise<T> {
		try {
			const entity = await this.getOne(options);
			
			if (!entity) {
				if (!data) {
					throw new InternalServerErrorException('Missing creation data');
				}
				return this.create(data);
			}
			return entity;
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002002, { options, data, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
			throw error;
		}
	}

	async getAll(options: Partial<FindPaginatedOptions<T>>): Promise<T[]> {
		try {
			const { relations, order, loadEagerRelations, withDeleted, select, where = { ...options.where, ...options.filter } } = options;
			return await this.repository.find({
				where,
				relations,
				order,
				loadEagerRelations,
				withDeleted,
				select
			});
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002002, { options, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
		}
	}

	async getAllPaginated(options: FindPaginatedOptions<T>): Promise<IPaginationResponse<T>> {
		try {
			const {
				limit = 10,
				page = 1,
				where = { ...options.where, ...options.filter },
				select,
				withDeleted,
				loadEagerRelations,
				order,
				relations,
				search
			} = options;
			// Dynamically add search conditions to the where clause
			if (search && typeof search === 'object') {
				for (const [key, value] of Object.entries(search)) {
					// Create a LIKE query for each search criterion
					if (typeof value === 'string') {
						where[key] = Like(`%${value}%`);
					} else {
						where[key] = value;
					}
				}
			}
			const take = limit === -1 ? undefined : limit;
			const skip = limit === -1 ? undefined : limit * (+page - 1);

			const findAndCountOptions = { where, order, relations, take, skip, loadEagerRelations, withDeleted, select };
			const [data, total] = await this.repository.findAndCount(findAndCountOptions);

			return {
				data,
				pagination: {
					limit: limit === -1 ? total : limit,
					page: limit === -1 ? 1 : page,
					totalItems: total,
					totalPages: Math.ceil(total / (limit === -1 ? total : limit))
				}
			};
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002002, { options, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
			throw error;
		}
	}

	@Transactional()
	async update(options: FindOrFailOptions<T>, data: QueryDeepPartialEntity<T>): Promise<T> {
		const entity = await this.getOneOrFail(options);
		const newEntity = extend<T>(entity, data);
		return newEntity.save();
	}

	@Transactional()
	async updateById(id: number, data: QueryDeepPartialEntity<T>, options?: Partial<FindOrFailOptions<T>>): Promise<T> {
		try {
			const entity = await this.getOneByIdOrFail(id, options);
			const newEntity = extend<T>(entity, data);
			newEntity.updatedAt = new Date();
			return newEntity.save();
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002003, { id, data, options, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
			throw error;
		}
	}

	@Transactional()
	async remove(options: FindOrFailOptions<T>): Promise<T> {
		const entity = await this.getOneOrFail(options);
		return this.repository.remove(entity);
	}

	@Transactional()
	async removeById(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T> {
		const entity = await this.getOneByIdOrFail(id, options);
		return this.repository.remove(entity);
	}

	@Transactional()
	removeAll(): Promise<DeleteResult> {
		return this.repository.delete({})
	}

	@Transactional()
	async softRemove(options: FindOrFailOptions<T>): Promise<T> {
		const entity = await this.getOneOrFail(options);
		return this.repository.softRemove(entity);
	}

	@Transactional()
	async softRemoveById(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T> {
		try {
			const entity = await this.getOneByIdOrFail(id, options);
			return this.repository.softRemove(entity);
		} catch (error) {
			logger.writeWithParameter(MsgIds.E002004, { id, options, notFoundMessage: this.notFoundMessage.split(' ')[0] }, error);
			throw error;
		}
	}

	@Transactional()
	softRemoveAll(): Promise<DeleteResult> {
		return this.repository.softDelete({})
	}

	count(options: Partial<FindOptions<T>>) {
		return this.repository.count(options);
	}

	getQueryBuilder(alias?: string) {
		return this.repository.createQueryBuilder(alias);
	}

	increment(where: FindOptionsWhere<T>, field: string, value: number): Promise<UpdateResult> {
		return this.repository.increment(where, field, value);
	}

	decrement(where: FindOptionsWhere<T>, field: string, value: number): Promise<UpdateResult> {
		return this.repository.decrement(where, field, value);
	}

	query<K = any>(queryString: string): Promise<K> {
		return this.repository.query(queryString);
	}
}
