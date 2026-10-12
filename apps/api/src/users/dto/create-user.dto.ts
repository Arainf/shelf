import {IsEnum, IsString, Length, Matches, MinLength} from "class-validator";
import {Role} from "@shelf/shared";

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    @Matches(/^[a-z0-9._-]+$/, { message: 'username: lowercase letter, digits, . _ - only'})
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @Length(2, 100)
    fullName: string;

    @IsEnum(Role)
    role: Role;
}
