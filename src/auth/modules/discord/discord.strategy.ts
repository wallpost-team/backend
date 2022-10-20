import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy, { Profile } from 'passport-discord';

import { AUTH_STRATEGIES, SERVICES } from 'src/common';

import discordConfig from './discord.config';
import { IDiscordService } from './discord.service.interface';

@Injectable()
export class DiscordStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.DISCORD,
) {
  constructor(
    @Inject(discordConfig.KEY)
    readonly config: ConfigType<typeof discordConfig>,

    @Inject(SERVICES.DISCORD_AUTH)
    private readonly discordAuthService: IDiscordService,
  ) {
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackUrl,
      scope: ['identify', 'guilds'],
    });
  }

  async validate(
    discordAccessToken: string,
    discordRefreshToken: string,
    profile: Profile,
  ) {
    return this.discordAuthService.validateUser({
      discordId: profile.id,
      discordAccessToken,
      discordRefreshToken,
    });
  }
}
