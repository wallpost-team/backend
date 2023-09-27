import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { SocialProvider, UserSocialProviderProfile } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import authConfig from 'src/auth/auth.config';
import { AccessToken } from 'src/auth/types';

import { ISocialProviderProfileService } from './services/profile.service.interface';

export interface IProfileStrategy {
  validate(accessToken: AccessToken): Promise<UserSocialProviderProfile>;
}

export const ProfileStrategy = (
  name: string,
  provider: SocialProvider,
): {
  new (
    config: ConfigType<typeof authConfig>,
    profile: ISocialProviderProfileService,
  ): IProfileStrategy;
} => {
  return class extends PassportStrategy(Strategy, name) {
    constructor(
      readonly config: ConfigType<typeof authConfig>,
      readonly profile: ISocialProviderProfileService,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          (request: Request) => request?.cookies?.Authorization,
        ]),
        secretOrKey: config.jwtAccessSecret,
      });
    }

    validate(accessToken: AccessToken): Promise<UserSocialProviderProfile> {
      return this.profile.validate({ userId: accessToken.sub, provider });
    }
  };
};
