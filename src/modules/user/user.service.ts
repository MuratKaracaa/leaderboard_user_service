import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { name } from 'faker';

import { AuthUtil } from '../../common/utils/auth.util';
import countries from '../../common/constants/countries';

import { User } from '../database/entities/user.entity';

const { findName } = name;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authUtil: AuthUtil,
  ) {}

  async findManyByUserId(userIdList: Array<string>): Promise<User[]> {
    return await this.userRepository.findBy({ userId: In(userIdList) });
  }

  async findByUserName(userName: string): Promise<User> {
    return await this.userRepository.findOneBy({ userName });
  }

  // for seeding purposes only
  async createUsers(): Promise<void> {
    const users = [];
    for (let i = 0; i < 5000; i++) {
      const { salt, hash } = await this.authUtil.generateSaltAndHash('12345');
      const index = Math.floor(Math.random() * countries.length);
      const user = this.userRepository.create({
        userName: `Mock User ${i}`,
        salt,
        hash,
        name: findName(),
        country: countries[index],
      });

      users.push(user);
    }

    await this.userRepository.save(users);
  }
}
