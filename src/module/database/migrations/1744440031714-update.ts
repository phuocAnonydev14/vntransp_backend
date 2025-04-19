import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1744440031714 implements MigrationInterface {
	name = 'Update1744440031714';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "category" ADD "content" character varying NOT NULL DEFAULT ''`
		);
		await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "tag" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "tag" SET DEFAULT 'internal'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "tag" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "tag" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "content"`);
	}
}
