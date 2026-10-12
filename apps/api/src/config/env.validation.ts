import {IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, validateSync} from "class-validator";
import {plainToInstance, Type} from "class-transformer";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment = Environment.Development;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    PORT: number = 3000;

    @IsString()
    DATABASE_PATH: string;

    @IsString()
    JWT_SECRET: string;

    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(15)
    BCRYPT_ROUNDS: number = 12;

    @IsString()
    @IsOptional()
    JWT_EXPIRES_IN: string = '12h';

    @IsString()
    @IsOptional()
    INITIAL_ADMIN_USERNAME?: string;
    
    @IsString()
    @IsOptional()
    INITIAL_ADMIN_PASSWORD?: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config);

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(`Config validation error: \n${errors.toString()}`);
    }

    return validatedConfig;
}