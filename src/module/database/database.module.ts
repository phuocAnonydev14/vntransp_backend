import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_NAME'),
				schema: configService.get<string>('DB_SCHEMA'),
				autoLoadEntities: true,
				migrationsTableName: `migrations`,
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
				retryAttempts: 10,
				retryDelay: 3000,
				migrationsRun: true,
				synchronize: false,
				cli: {
					entitiesDir: 'src',
					migrationsDir: 'src/database/migrations',
					subscribersDir: 'subscriber'
				}
			}),
			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				return (
					getDataSourceByName('default') ||
					addTransactionalDataSource(new DataSource(options))
				);
			}
		})
	]
})
export class DatabaseModule {}
