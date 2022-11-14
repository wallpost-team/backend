import { Inject, Injectable } from '@nestjs/common';
import { REST } from '@discordjs/rest';
import {
  RESTGetAPICurrentUserGuildsResult,
  Routes,
} from 'discord-api-types/v10';
import discordConfig from './discord.config';
import { ConfigType } from '@nestjs/config';
import { discordApiCall } from './discordApiCall.decorator';

@Injectable()
export class DiscordService {
  constructor(
    @Inject(discordConfig.KEY)
    private readonly config: ConfigType<typeof discordConfig>,
  ) {}

  private readonly rest = new REST({ version: '10' }).setToken(
    this.config.token,
  );

  @discordApiCall
  async getUserGuilds(
    accessToken: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult> {
    return (await this.rest.get(Routes.userGuilds(), {
      auth: false,
      headers: {
        Authorization: accessToken,
      },
    })) as RESTGetAPICurrentUserGuildsResult;
  }

  async getBotGuilds(): Promise<RESTGetAPICurrentUserGuildsResult> {
    return (await this.rest.get(
      Routes.userGuilds(),
    )) as RESTGetAPICurrentUserGuildsResult;
  }

  async getCommonGuilds(accessToken: string) {
    const botGuidls = await this.getBotGuilds();
    const userGuilds = await this.getUserGuilds(accessToken);

    const commonGuidls = botGuidls.filter((botGuild) =>
      userGuilds.some((userGuild) => botGuild.id === userGuild.id),
    );
    return commonGuidls;
  }
}
