import argon2 from 'argon2';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IAuthService } from './auth.service.interface';
import { SignedTokens, JwtPayload } from './types';

import authConfig from './auth.config';
import { SERVICES } from 'src/common';
import { IUserService } from 'src/user/user.service.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private jwt: JwtService,
    @Inject(SERVICES.USER) private readonly user: IUserService,
  ) {}

  async authenticate(user: User): Promise<SignedTokens> {
    const tokens = await this.signTokens({ sub: user.id });
    await this.setRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async setRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.user.update(
      { id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<SignedTokens> {
    const user = await this.user.find({ id: userId });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMathes = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMathes) throw new ForbiddenException('Access Denied');

    return this.authenticate(user);
  }

  private async signTokens(payload: JwtPayload): Promise<SignedTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.jwtAccessSecret,
      expiresIn: 60 * 2,
    });
  }
  private signRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.jwtRefreshSecret,
      expiresIn: 60 * 60 * 24 * 7,
    });
  }
}

export const authProvider = {
  provide: SERVICES.AUTH,
  useClass: AuthService,
};
