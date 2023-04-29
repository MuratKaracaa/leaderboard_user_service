import { Injectable } from '@nestjs/common';
import { randomBytes, pbkdf2 } from 'crypto';
import { JwtPayload, Secret, SignOptions, sign } from 'jsonwebtoken';
import { promisify } from 'util';

import expiresInOptions from '../constants/expiresInOptions';

@Injectable()
export class AuthUtil {
  private readonly iterations = 1000;
  private readonly keylen = 64;
  private readonly digest = 'sha256';
  private readonly pbkdf2Async = promisify(pbkdf2);
  private readonly signAsync: (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ) => Promise<string> = promisify(sign);

  async generateSaltAndHash(password: string): Promise<Record<string, string>> {
    const salt = randomBytes(32).toString('hex');
    const hash = (
      await this.pbkdf2Async(
        password,
        salt,
        this.iterations,
        this.keylen,
        this.digest,
      )
    ).toString('hex');

    return { salt, hash };
  }

  async verifyPassword(
    password: string,
    salt: string,
    hash: string,
  ): Promise<boolean> {
    const compareHash = (
      await this.pbkdf2Async(
        password,
        salt,
        this.iterations,
        this.keylen,
        this.digest,
      )
    ).toString('hex');
    return compareHash === hash;
  }

  async issueToken(sub: string): Promise<string> {
    const private_key = process.env.JWT_KEY;
    const iat = Date.now();
    const payload: JwtPayload = { sub, iat };
    const tokenSignOptions: SignOptions = {
      algorithm: 'HS256',
      expiresIn: expiresInOptions.oneYear,
    };

    const token = await this.signAsync(payload, private_key, tokenSignOptions);
    return token;
  }
}
