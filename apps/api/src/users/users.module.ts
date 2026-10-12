import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import {InitialAdminSeeder} from "./initial-admin.seeder.js";
import {User} from "./user.entity.js";


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, InitialAdminSeeder],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
