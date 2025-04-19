import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1744727452295 implements MigrationInterface {
    name = 'Update1744727452295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_b53be496cc168eb5c2c734385dd"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_b53be496cc168eb5c2c734385dd" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_b53be496cc168eb5c2c734385dd"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_b53be496cc168eb5c2c734385dd" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
