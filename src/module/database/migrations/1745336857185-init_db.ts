import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1745336857185 implements MigrationInterface {
    name = 'InitDb1745336857185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "desc" text, "content" text NOT NULL, "slug" character varying NOT NULL, "view" integer NOT NULL DEFAULT '0', "tag" text NOT NULL DEFAULT 'internal', "draft" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "phone" character varying(50) NOT NULL, "message" character varying, "categoryId" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "slug" character varying NOT NULL DEFAULT '', "content" character varying NOT NULL DEFAULT '', "view" bigint NOT NULL DEFAULT '0', CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imageUpload" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "imageUrl" text NOT NULL, "type" character varying, "fileKey" character varying NOT NULL, "blogId" integer, "categoryId" integer, CONSTRAINT "REL_aa13495d6b6dc2e95c1ad8863d" UNIQUE ("blogId"), CONSTRAINT "REL_b53be496cc168eb5c2c734385d" UNIQUE ("categoryId"), CONSTRAINT "PK_54f0bcb9f60b1bd2f7bf1bfb23a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "verificationToken" character varying, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recruitment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(50) NOT NULL, "slug" character varying(50) NOT NULL, "location" character varying(50) NOT NULL, "type" character varying(50) NOT NULL, "salary" integer, "description" text NOT NULL, "requirements" text NOT NULL, "benefits" text NOT NULL, "deadline" date NOT NULL, CONSTRAINT "PK_fb4ef13a6aadbf704c92679b09a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_f65d6ce70b35781244d5a0e3aea" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imageUpload" ADD CONSTRAINT "FK_b53be496cc168eb5c2c734385dd" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_b53be496cc168eb5c2c734385dd"`);
        await queryRunner.query(`ALTER TABLE "imageUpload" DROP CONSTRAINT "FK_aa13495d6b6dc2e95c1ad8863d2"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_f65d6ce70b35781244d5a0e3aea"`);
        await queryRunner.query(`DROP TABLE "recruitment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "imageUpload"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
