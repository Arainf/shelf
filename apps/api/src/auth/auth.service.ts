import {Injectable, UnauthorizedException} from '@nestjs/common';
import {toPublic, UsersService} from "../users/users.service.js";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || 12;

@Injectable()
export class AuthService {
    private readonly dummyHash = bcrypt.hashSync('timing-equalizer', BCRYPT_ROUNDS);

    constructor(
        private readonly users: UsersService,
        private readonly jwt: JwtService
    ) {}

    async login(username: string, password: string){
        const user = await this.users.findByUsername(username);
        const ok = await bcrypt.compare(password, user?.passwordHash ?? this.dummyHash);

        if (!user || !ok || !user.isActive){
            throw new UnauthorizedException('Invalid username or password');
        }

        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            tv: user.tokenVersion,
        });

        return { accessToken, user: toPublic(user) };
    }
}
