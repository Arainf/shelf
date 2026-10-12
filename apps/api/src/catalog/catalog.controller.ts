import {Body, Controller, Get, Post} from '@nestjs/common';
import {Public} from "../auth/decorators/public.decorator.js";
import {CatalogService} from "./catalog.service.js";
import {CreateProductDto, CreateUnitDto} from "./catalog.dto.js";

@Public()
@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get('units')
    getUnits() {
        return this.catalogService.findAllUnits()
    }

    @Post('units')
    createUnit(@Body() dto: CreateUnitDto) {
        return this.catalogService.createUnit(dto);
    }

    @Get('products')
    getProducts() {
        return this.catalogService.findAllProducts();
    }

    @Post('products')
    createProduct(@Body() dto: CreateProductDto) {
        return this.catalogService.createProduct(dto);
    }
}
