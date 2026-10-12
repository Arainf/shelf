import {IsEnum} from "class-validator";
import {Role} from "@shelf/shared";

export class UpdateRoleDto {
    @IsEnum(Role)
    role: Role;
}