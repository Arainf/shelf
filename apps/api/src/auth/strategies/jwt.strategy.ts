import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UsersService} from "../../users/users.service.js";
import {ConfigService} from "@nestjs/config";
import { type AuthUser} from "../decorators/create-user.decorator.js";


interface JwtPayload {
    sub: string;
    tv: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly users: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
            algorithms: ['HS256'],
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.users.findById(payload.sub);
        if (!user || !user.isActive || user.tokenVersion !== payload.tv) {
            throw new UnauthorizedException();
        }

        return { id: user.id, username: user.username, role: user.role };
    }

}
