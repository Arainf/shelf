import {IsEnum, IsNumber, IsOptional, IsString, validateSync} from "class-validator";
import {plainToInstance} from "class-transformer";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    @IsOptional()
    PORT: number = 3000;

    @IsString()
    DATABASE_PATH: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(`Config validation error: \n${errors.toString()}`);
    }

    return validatedConfig;
}