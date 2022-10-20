import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AUTH_STRATEGIES } from 'src/common';

import authConfig from '../auth.config';
import { Jwt, JwtToRefresh } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT_REFRESH,
) {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: Jwt): JwtToRefresh {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refreshToken = req
      .header('Authorization')!
      .replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
