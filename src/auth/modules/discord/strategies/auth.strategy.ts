import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy, { Profile } from 'passport-discord';
import { AUTH_STRATEGIES, SERVICES } from 'src/common';

import discordAuthConfig from '../discordAuth.config';
import { IDiscordAuthService } from '../services/auth/auth.service.interface';

@Injectable()
export class DiscordStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.DISCORD_OAUTH2,
) {
  constructor(
    @Inject(discordAuthConfig.KEY)
    readonly config: ConfigType<typeof discordAuthConfig>,

    @Inject(SERVICES.DISCORD_AUTH)
    private readonly discordAuth: IDiscordAuthService,
  ) {
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackUrl,
      scope: ['identify', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.discordAuth.validateDiscordAuth({
      discordId: profile.id,
      accessToken,
      refreshToken,
    });
  }
}
