import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateUnitDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    symbol: string;
}

export class CreateProductUnitDto {
    @IsString()
    @IsNotEmpty()
    unitId: string;

    @IsNumber()
    conversionFactor: number;

    @IsBoolean()
    @IsOptional()
    isBase?: boolean;

    @IsNumber()
    price: number;

    @IsNumber()
    @IsOptional()
    costPrice?: number;

    @IsString()
    @IsOptional()
    barcode?: string;
}

export class CreateVariantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductUnitDto)
    units: CreateProductUnitDto[];
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants: CreateVariantDto[];
}