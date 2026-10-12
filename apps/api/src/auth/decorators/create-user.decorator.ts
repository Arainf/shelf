import {Role} from "@shelf/shared";
import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export interface AuthUser {
    id: string;
    username: string;
    role: Role;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);