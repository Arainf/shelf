import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Unit} from "./entities/unit.entity.js";
import {Repository} from "typeorm";
import {Product} from "./entities/product.entity.js";
import {ProductUnit} from "./entities/product-unit.entity.js";
import {Variant} from "./entities/variant.entity.js";
import {CreateProductDto, CreateUnitDto} from "./catalog.dto.js";

@Injectable()
export class CatalogService {
    constructor(
        @InjectRepository(Unit) private unitRepo: Repository<Unit>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Variant) private variantRepo: Repository<Variant>,
        @InjectRepository(ProductUnit) private productUnitRepo: Repository<ProductUnit>,
        ) {}

    async createUnit(dto: CreateUnitDto): Promise<Unit> {
        const unit = this.unitRepo.create(dto);
        return this.unitRepo.save(unit);
    }

    async findAllUnits(): Promise<Unit[]> {
        return this.unitRepo.find({ order: { name: 'ASC'} });
    }

    async createProduct(dto: CreateProductDto): Promise<Product> {
        const product = this.productRepo.create({
            name: dto.name,
            description: dto.description,
            variants: dto.variants.map((v) =>
                this.variantRepo.create({
                    name: v.name,
                    sku: v.sku,
                    units: v.units.map((u) => this.productUnitRepo.create(u)),
                }),
            ),
        });

        return this.productRepo.save(product);
    }

    async findAllProducts(): Promise<Product[]> {
        return this.productRepo.find({
            relations: {
                variants: {
                    units: {
                        unit: true,
                    },
                },
            },
        order: { name: 'ASC' },
    });
    }
}
