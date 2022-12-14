import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_STRATEGIES, SERVICES } from 'src/common';
import { IUserService } from 'src/user/user.service.interface';

import authConfig from '../auth.config';
import { AccessToken } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT_ACCESS,
) {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    @Inject(SERVICES.USER) private readonly user: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authorization,
      ]),
      secretOrKey: config.jwtAccessSecret,
    });
  }

  async validate(accessToken: AccessToken): Promise<User> {
    const user = await this.user.get({ id: accessToken.sub });
    return user;
  }
}
