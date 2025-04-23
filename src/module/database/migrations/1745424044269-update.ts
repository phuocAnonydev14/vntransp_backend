import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1745424044269 implements MigrationInterface {
    name = 'Update1745424044269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruitment" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "recruitment" ALTER COLUMN "type" SET DEFAULT 'fulltime'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruitment" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "recruitment" ADD "slug" character varying(50) NOT NULL`);
    }

}
