import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { validate } from "./config/env.validation.js";
import { HealthController } from "./health.controller.js";
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard.js";
import {RolesGuard} from "./auth/guards/roles.guard.js";


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validate,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'better-sqlite3',
      database: config.get<string>('DATABASE_PATH'),
      synchronize: false,
      autoLoadEntities: true,
      prepareDatabase: (db) => {
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = WAL');
      }
    })
  }),
  AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AppModule {}
