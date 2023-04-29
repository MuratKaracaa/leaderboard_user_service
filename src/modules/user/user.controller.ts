import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import UserServiceErrors from 'src/common/constants/errors';
import { AuthUtil } from 'src/common/utils/auth.util';

import { LoginRequest, LoginResponse, UserInfo } from './user';
import { UserService } from './user.service';
import { GetUserInfoMapRequest, GetUserInfoMapResponse } from './user';

import { User } from '../database/entities/user.entity';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authUtil: AuthUtil,
  ) {}

  @GrpcMethod('UserService', 'Login')
  async login(
    data: LoginRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<LoginResponse> {
    const user: User = await this.userService.findByUserName(data.userName);

    if (!user) {
      throw new HttpException(
        UserServiceErrors.USERNOTFOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordVerified = this.authUtil.verifyPassword(
      data.password,
      user.salt,
      user.hash,
    );

    if (!isPasswordVerified) {
      throw new HttpException(
        UserServiceErrors.PASSWORDNOTVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.authUtil.issueToken(`${user.userId}`);

    const response: LoginResponse = { token };

    return response;
  }

  @GrpcMethod('UserService', 'GetUserInfoMap')
  async GetUserInfo(
    data: GetUserInfoMapRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<GetUserInfoMapResponse> {
    const userListFromDb = await this.userService.findManyByUserId(
      data.userIdList,
    );
    const userMap: { [key: number]: UserInfo } = {};

    for (const user of userListFromDb) {
      userMap[user.userId] = { playerName: user.name, country: user.country };
    }

    const response: GetUserInfoMapResponse = { userMap };

    return response;
  }
}
