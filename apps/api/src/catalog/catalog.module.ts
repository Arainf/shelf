import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Unit} from "./entities/unit.entity.js";
import {Product} from "./entities/product.entity.js";
import {ProductUnit} from "./entities/product-unit.entity.js";
import {Variant} from "./entities/variant.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Unit, Product, Variant ,ProductUnit])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService]
})
export class CatalogModule {}
