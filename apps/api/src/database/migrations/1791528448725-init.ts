import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1791528448725 implements MigrationInterface {
    name = 'Init1791528448725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "variants" ("id" varchar PRIMARY KEY NOT NULL, "productId" varchar NOT NULL, "name" text NOT NULL, "sku" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_36c4c7a3b994abc268f8ebbf489" UNIQUE ("sku"))`);
        await queryRunner.query(`CREATE TABLE "unit" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_5618100486bb99d78de022e5829" UNIQUE ("name"), CONSTRAINT "UQ_32a519bcda20c9e540be84544db" UNIQUE ("symbol"))`);
        await queryRunner.query(`CREATE TABLE "product_units" ("id" varchar PRIMARY KEY NOT NULL, "variantId" varchar NOT NULL, "unitId" varchar NOT NULL, "conversionFactor" real NOT NULL DEFAULT (1), "isBase" boolean NOT NULL DEFAULT (0), "price" real NOT NULL, "costPrice" real, "barcode" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_variants" ("id" varchar PRIMARY KEY NOT NULL, "productId" varchar NOT NULL, "name" text NOT NULL, "sku" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_36c4c7a3b994abc268f8ebbf489" UNIQUE ("sku"), CONSTRAINT "FK_bdbfe33a28befefa9723c355036" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_variants"("id", "productId", "name", "sku", "createdAt", "updatedAt") SELECT "id", "productId", "name", "sku", "createdAt", "updatedAt" FROM "variants"`);
        await queryRunner.query(`DROP TABLE "variants"`);
        await queryRunner.query(`ALTER TABLE "temporary_variants" RENAME TO "variants"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_units" ("id" varchar PRIMARY KEY NOT NULL, "variantId" varchar NOT NULL, "unitId" varchar NOT NULL, "conversionFactor" real NOT NULL DEFAULT (1), "isBase" boolean NOT NULL DEFAULT (0), "price" real NOT NULL, "costPrice" real, "barcode" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c7878a55f9f2f14290e1cff6dd8" FOREIGN KEY ("variantId") REFERENCES "variants" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d373a20e06122cc1016d803104c" FOREIGN KEY ("unitId") REFERENCES "unit" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product_units"("id", "variantId", "unitId", "conversionFactor", "isBase", "price", "costPrice", "barcode", "createdAt", "updatedAt") SELECT "id", "variantId", "unitId", "conversionFactor", "isBase", "price", "costPrice", "barcode", "createdAt", "updatedAt" FROM "product_units"`);
        await queryRunner.query(`DROP TABLE "product_units"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_units" RENAME TO "product_units"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_units" RENAME TO "temporary_product_units"`);
        await queryRunner.query(`CREATE TABLE "product_units" ("id" varchar PRIMARY KEY NOT NULL, "variantId" varchar NOT NULL, "unitId" varchar NOT NULL, "conversionFactor" real NOT NULL DEFAULT (1), "isBase" boolean NOT NULL DEFAULT (0), "price" real NOT NULL, "costPrice" real, "barcode" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "product_units"("id", "variantId", "unitId", "conversionFactor", "isBase", "price", "costPrice", "barcode", "createdAt", "updatedAt") SELECT "id", "variantId", "unitId", "conversionFactor", "isBase", "price", "costPrice", "barcode", "createdAt", "updatedAt" FROM "temporary_product_units"`);
        await queryRunner.query(`DROP TABLE "temporary_product_units"`);
        await queryRunner.query(`ALTER TABLE "variants" RENAME TO "temporary_variants"`);
        await queryRunner.query(`CREATE TABLE "variants" ("id" varchar PRIMARY KEY NOT NULL, "productId" varchar NOT NULL, "name" text NOT NULL, "sku" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_36c4c7a3b994abc268f8ebbf489" UNIQUE ("sku"))`);
        await queryRunner.query(`INSERT INTO "variants"("id", "productId", "name", "sku", "createdAt", "updatedAt") SELECT "id", "productId", "name", "sku", "createdAt", "updatedAt" FROM "temporary_variants"`);
        await queryRunner.query(`DROP TABLE "temporary_variants"`);
        await queryRunner.query(`DROP TABLE "product_units"`);
        await queryRunner.query(`DROP TABLE "unit"`);
        await queryRunner.query(`DROP TABLE "variants"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
