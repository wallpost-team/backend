import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_STRATEGIES, SERVICES } from 'src/common';
import { IUserService } from 'src/user/user.service.interface';

import authConfig from '../auth.config';
import { TokensService } from '../services';
import { RefreshToken } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT_REFRESH,
) {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private readonly tokens: TokensService,
    @Inject(SERVICES.USER) private readonly user: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: config.jwtRefreshSecret,
    });
  }

  async validate(oldRefreshToken: RefreshToken): Promise<User> {
    const oldRefreshTokenId = await this.tokens.getRefreshTokenId(
      oldRefreshToken.jti,
    );

    if (!oldRefreshTokenId) throw new ForbiddenException('Access Denied.');

    await this.tokens.deleteRefreshToken(oldRefreshTokenId);

    return this.user.get({ id: oldRefreshToken.sub });
  }
}
