import {Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {UsersService} from "./users.service.js";
import {CreateUserDto} from "./dto/create-user.dto.js";
import {UpdateRoleDto} from "./dto/update-role.dto.js";
import {SetActiveDto} from "./dto/set-active.dto.js";
import {ResetPasswordDto} from "./dto/reset-password.dto.js";
import { type AuthUser, CurrentUser} from "../auth/decorators/create-user.decorator.js";
import {Role} from "@shelf/shared";
import {Roles} from "../auth/decorators/roles.decorator.js";

@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
    constructor(private readonly users:UsersService) {}

    @Get()
    list() {
        return this.users.findAllUsers();
    }

    @Post()
    create(@Body() dto: CreateUserDto){
        return this.users.createUser(dto);
    }

    @Patch(':id/role')
    setRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateRoleDto,
        @CurrentUser() actor: AuthUser,
    ) {
        return this.users.setUserRole(actor.id, id, dto.role);
    }

    @Patch(':id/active')
    setActive(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: SetActiveDto,
        @CurrentUser() actor: AuthUser,
    ) {
        return this.users.setUserActive(actor.id, id, dto.isActive);
    }

    @Post(':id/password')
    async resetPassword(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ResetPasswordDto) {
        await this.users.resetUserPassword(id, dto.newPassword);
        return { ok: true };
    }
}
