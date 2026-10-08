import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { validate} from "./config/env.validation.js";

import {AppController} from "@nestjs/schematics/dist/lib/application/files/ts/src/app.controller.js";
import {HealthController} from "./health.controller.js";

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
        db.pragma('foreign_key = ON');
        db.pragma('journal_mode = ON');
      }
    })
  }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
