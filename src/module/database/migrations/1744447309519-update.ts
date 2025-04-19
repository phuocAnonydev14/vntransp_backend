import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1744447309519 implements MigrationInterface {
	name = 'Update1744447309519';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "location"`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "date"`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
		await queryRunner.query(
			`ALTER TABLE "appointment" ADD "email" character varying(50) NOT NULL`
		);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "categoryId" integer`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "name"`);
		await queryRunner.query(
			`ALTER TABLE "appointment" ADD "name" character varying(50) NOT NULL`
		);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "phone"`);
		await queryRunner.query(
			`ALTER TABLE "appointment" ADD "phone" character varying(50) NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "appointment" ADD CONSTRAINT "FK_f65d6ce70b35781244d5a0e3aea" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "appointment" DROP CONSTRAINT "FK_f65d6ce70b35781244d5a0e3aea"`
		);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "phone"`);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "phone" character varying`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "name"`);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "name" character varying`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "categoryId"`);
		await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "email"`);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "time" character varying`);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "date" TIMESTAMP`);
		await queryRunner.query(`ALTER TABLE "appointment" ADD "location" character varying`);
	}
}
