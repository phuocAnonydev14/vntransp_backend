import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1744457167100 implements MigrationInterface {
	name = 'Update1744457167100';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "imageUpload" ADD "fileKey" character varying NOT NULL`
		);
		await queryRunner.query(`ALTER TABLE "imageUpload" ALTER COLUMN "type" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "imageUpload" ALTER COLUMN "type" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "imageUpload" DROP COLUMN "fileKey"`);
	}
}
