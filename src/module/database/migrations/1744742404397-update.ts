import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1744742404397 implements MigrationInterface {
    name = 'Update1744742404397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
