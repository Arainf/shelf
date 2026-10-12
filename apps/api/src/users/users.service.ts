import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {User} from "./user.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto.js";
import * as bcrypt from 'bcryptjs';
import { Role } from '@shelf/shared';
import {ConfigService} from "@nestjs/config";

export type PublicUser = Pick<User, 'id' | 'username' | 'fullName' | 'role' | 'isActive' | 'createdAt'>;

export function toPublic(u: User): PublicUser{
    return {
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
    };
}

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>,
                private readonly config: ConfigService) {}

    private get rounds(): number {
        return this.config.getOrThrow<number>('BCRYPT_ROUNDS');
    }

    async createUser(dto: CreateUserDto): Promise<PublicUser> {
        if (await this.users.existsBy({ username: dto.username })) {
            throw new ConflictException("Username already taken");
        }

        const user = this.users.create({
            username: dto.username,
            fullName: dto.fullName,
            role: dto.role,
            passwordHash: await bcrypt.hash(dto.password, this.rounds),
        });

        return toPublic(await this.users.save(user));
    }

    countUsers(): Promise<number> {
        return this.users.count();
    }

    findByUsername(username: string): Promise<User | null> {
        return this.users.findOneBy({ username });
    }

    findById(id: string): Promise<User | null> {
        return this.users.findOneBy({ id });
    }

    async findAllUsers(): Promise<PublicUser[]> {
        const rows = await this.users.find({ order: { createdAt: 'ASC' } });
        return rows.map(toPublic);
    }

    async setUserRole(actorId: string, id: string, role: Role): Promise<PublicUser> {
        if (actorId === id) throw new ForbiddenException('You cannot change your own role');

        const user = await this.getOrFail(id);
        if (user.role === Role.ADMIN && role !== Role.ADMIN || role === Role.SUPERADMIN) {
            await this.assertAnotherActiveAdmin(id);
        }
        user.role = role;
        user.tokenVersion += 1;
        return toPublic(await this.users.save(user));

    }

    async setUserActive(actorId: string, id: string, isActive: boolean): Promise<PublicUser> {
        if (actorId === id) throw new ForbiddenException('You cannot deactivate yourself');

        const user = await this.getOrFail(id);
        if (!isActive && user.role === Role.ADMIN) {
            await this.assertAnotherActiveAdmin(id);
        }

        user.isActive = isActive;
        user.tokenVersion += 1;
        return toPublic(await this.users.save(user));
    }

    async resetUserPassword(id: string, newPassword: string): Promise<void> {
        const user = await this.getOrFail(id);
        user.passwordHash = await bcrypt.hash(newPassword, this.rounds);
        user.tokenVersion += 1;
        await this.users.save(user);
    }

    private async getOrFail(id: string): Promise<User> {
        const user = await this.users.findOneBy({ id: id });
        if (!user) throw new NotFoundException("User not found");
        return user;
    }

    private async assertAnotherActiveAdmin(excludedId: string): Promise<void> {
        const others = await this.users.countBy({
            role: Role.ADMIN,
            isActive: true,
            id: Not(excludedId),
        });
        if (others === 0){
            throw new ConflictException("At least one active admin must remain");
        }
    }
}
