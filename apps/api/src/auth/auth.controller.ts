import {Body, Controller, Get, HttpCode, Post} from '@nestjs/common';
import {AuthService} from "./auth.service.js";
import {LoginDto} from "./dto/login.dto.js";
import {type AuthUser, CurrentUser} from "./decorators/create-user.decorator.js";
import {Public} from "./decorators/public.decorator.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Public()
    @Post('login')
    @HttpCode(200)
    login(@Body()dto: LoginDto) {
        return this.auth.login(dto.username, dto.password);
    }

    @Get('me')
    me(@CurrentUser() user: AuthUser) {
        return user;
    }
}
