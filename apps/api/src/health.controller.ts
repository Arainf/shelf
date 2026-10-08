import {Controller, Get, ServiceUnavailableException} from "@nestjs/common";
import {DataSource} from "typeorm";


@Controller('health')
export class HealthController {
    constructor(private readonly dataSource: DataSource) {}

    @Get()
    async check() {
        try {
            await this.dataSource.query('SELECT 1');

            return {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            throw new ServiceUnavailableException({
                status: 'error',
                database: 'disconnected',
                error: (error as Error).message,
            });
        }
    }
}
