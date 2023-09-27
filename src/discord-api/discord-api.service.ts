import { REST } from '@discordjs/rest';
import { Inject, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DiscordProfile } from '@prisma/client';
import {
  GatewayVersion,
  RESTGetAPIChannelResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPIGuildChannelsResult,
  Routes,
} from 'discord-api-types/v10';
import { IDiscordAuthService } from 'src/auth/modules/discord/services/auth/auth.service.interface';
import { SERVICES } from 'src/common';
import discordApiConfig from './discord-api.config';
import { API } from '@discordjs/core';
import { IDiscordApiService } from './discord-api.interface';

// TODO: Rewrite using @discordjs/core API

export class DiscordApi {
  private client: REST;

  constructor(token: string, authPrefix: 'Bearer' | 'Bot' = 'Bearer') {
    this.client = new REST({ version: GatewayVersion, authPrefix }).setToken(
      token,
    );
  }

  getUser(userId?: string) {
    return this.client.get(
      Routes.user(userId),
    ) as Promise<RESTGetAPICurrentUserResult>;
  }

  listUserGuilds() {
    return this.client.get(
      Routes.userGuilds(),
    ) as Promise<RESTGetAPICurrentUserGuildsResult>;
  }

  listGuildChannels(guildId: string) {
    return this.client.get(
      Routes.guildChannels(guildId),
    ) as Promise<RESTGetAPIGuildChannelsResult>;
  }

  getChannel(channelId: string) {
    return this.client.get(
      Routes.channel(channelId),
    ) as Promise<RESTGetAPIChannelResult>;
  }
}

export class DiscordApiService implements IDiscordApiService {
  constructor(
    @Inject(discordApiConfig.KEY)
    private readonly config: ConfigType<typeof discordApiConfig>,
    @Inject(SERVICES.DISCORD_AUTH)
    private readonly auth: IDiscordAuthService,
  ) {}

  protected async getApi(profile?: DiscordProfile) {
    if (profile) {
      let tokenDetails = await this.auth.decryptTokenDetails(
        profile.tokenDetails,
      );
      if (tokenDetails.expired()) {
        tokenDetails = await this.auth.refresh(tokenDetails);
      }
      return new DiscordApi(tokenDetails.token.access_token);
    }
    return new DiscordApi(this.config.token, 'Bot');
  }

  async getApi1(profile?: DiscordProfile) {
    let rest: REST;
    if (profile) {
      let tokenDetails = await this.auth.decryptTokenDetails(
        profile.tokenDetails,
      );
      if (tokenDetails.expired()) {
        tokenDetails = await this.auth.refresh(tokenDetails);
      }
      rest = new REST({
        version: GatewayVersion,
        authPrefix: 'Bearer',
      }).setToken(tokenDetails.token.access_token);
    } else {
      rest = new REST({ version: GatewayVersion, authPrefix: 'Bot' }).setToken(
        this.config.token,
      );
    }
    return new API(rest);
  }
}

export const discordApiProvider: Provider = {
  provide: SERVICES.DISCORD_API,
  useClass: DiscordApiService,
};
