import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { DiscordProfile } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import authConfig from 'src/auth/auth.config';
import { AUTH_STRATEGIES, SERVICES } from 'src/common';
import { AccessToken } from 'src/auth/types';

import { IDiscordProfileService } from './services/profile/profile.service.interface';

@Injectable()
export class DiscordProfileStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.DISCORD_PROFILE,
) {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    @Inject(SERVICES.DISCORD_PROFILE)
    private readonly discordProfile: IDiscordProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authorization,
      ]),
      secretOrKey: config.jwtAccessSecret,
    });
  }

  validate(accessToken: AccessToken): Promise<DiscordProfile> {
    return this.discordProfile.validateDiscordProfile({ id: accessToken.sub });
  }
}
