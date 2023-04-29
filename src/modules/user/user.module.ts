import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthUtil } from 'src/common/utils/auth.util';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthUtil],
})
export class UserModule {}
