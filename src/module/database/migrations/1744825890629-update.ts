import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1744825890629 implements MigrationInterface {
    name = 'Update1744825890629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "view" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "view"`);
    }

}
