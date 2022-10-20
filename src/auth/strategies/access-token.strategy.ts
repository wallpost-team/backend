import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_STRATEGIES, SERVICES } from 'src/common';
import { IUserService } from 'src/user/user.service.interface';

import authConfig from '../auth.config';
import { Jwt } from '../types';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtAccessSecret,
    });
  }

  async validate(payload: Jwt): Promise<User> {
    const user = await this.user.find({ id: payload.sub });
    if (!user) throw new ForbiddenException('Access denied');
    return user;
  }
}
