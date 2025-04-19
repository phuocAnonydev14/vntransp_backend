import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1744429434873 implements MigrationInterface {
	name = 'InitData1744429434873';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "imageUpload" ADD "categoryId" integer`);
		await queryRunner.query(
			`ALTER TABLE "imageUpload" ADD CONSTRAINT "UQ_b53be496cc168eb5c2c734385dd" UNIQUE ("categoryId")`
		);
		await queryRunner.query(
			`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_b53be496cc168eb5c2c734385dd" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_b53be496cc168eb5c2c734385dd"`
		);
		await queryRunner.query(
			`ALTER TABLE "imageUpload" DROP CONSTRAINT "UQ_b53be496cc168eb5c2c734385dd"`
		);
		await queryRunner.query(`ALTER TABLE "imageUpload" DROP COLUMN "categoryId"`);
	}
}
