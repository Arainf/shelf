import {Injectable, Logger, OnApplicationBootstrap} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "./users.service.js";
import {Role} from "@shelf/shared";

@Injectable()
export class InitialAdminSeeder implements OnApplicationBootstrap {
    private readonly logger = new Logger(InitialAdminSeeder.name);

    constructor(
        private readonly users: UsersService,
        private readonly config: ConfigService,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        if ((await this.users.countUsers()) > 0) return;

        const username = this.config.get<string>('INITIAL_ADMIN_USERNAME');
        const password = this.config.get<string>('INITIAL_ADMIN_PASSWORD');
        if (!username || !password) {
            this.logger.warn('No users exist and INITIAL_ADMIN_* is not set. Nobody can log in yet.');
            return;
        }

        await this.users.createUser({ username, password, fullName: 'Administrator', role: Role.ADMIN });
        this.logger.log(`Created initial admin "${username}". Delete INITIAL_ADMIN_PASSWORD from .env now.`);
    }

}