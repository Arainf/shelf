import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1791720639904 implements MigrationInterface {
    name = 'AddUsersTable1791720639904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar(50) NOT NULL, "password_hash" text NOT NULL, "full_name" varchar(255), "role" varchar(25) NOT NULL, "is_active" boolean NOT NULL DEFAULT (1), "token_version" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
