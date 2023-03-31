import { Inject, Injectable, Provider } from '@nestjs/common';
import {
  PermissionFlagsBits,
  RESTGetAPICurrentUserGuildsResult,
} from 'discord-api-types/v10';

import { SERVICES } from 'src/common';

import { IDiscordApiService } from './api.service.interface';
import { IDiscordApiProviderService } from '../provider/provider.service.interface';

@Injectable()
export class DiscordApiService implements IDiscordApiService {
  constructor(
    @Inject(SERVICES.DISCORD_API_PROVIDER)
    private readonly apiProvider: IDiscordApiProviderService,
  ) {}

  getUser(tokenDetails: string) {
    return this.apiProvider.getUser(tokenDetails);
  }

  async getGuilds(userTokenDetails: string) {
    const guilds = await this.fetchGuilds(userTokenDetails);
    const manageable = this.matchUserToBotGuilds(
      guilds,
      this.matchManageableGuilds,
    );
    const inviteable = this.matchUserToBotGuilds(
      guilds,
      this.matchInviteableGuilds,
    );
    return { manageable, inviteable };
  }

  async getManageableGuilds(userTokenDetails: string) {
    const guilds = await this.fetchGuilds(userTokenDetails);
    return this.matchUserToBotGuilds(guilds, this.matchManageableGuilds);
  }

  private matchManageableGuilds: UserToBotGuildsPredicate = (u, b) => u === b;

  async getInviteableGuilds(userTokenDetails: string) {
    const guilds = await this.fetchGuilds(userTokenDetails);
    return this.matchUserToBotGuilds(guilds, this.matchInviteableGuilds);
  }

  private matchInviteableGuilds: UserToBotGuildsPredicate = (u, b) => u !== b;

  private async fetchUserGuildsWhereAdmin(tokenDetails: string) {
    const userGuilds = await this.apiProvider.getUserGuilds(tokenDetails);
    const userGuildsWhereAdmin = userGuilds.filter(
      ({ permissions }) =>
        (BigInt(permissions) & PermissionFlagsBits.Administrator) ===
        PermissionFlagsBits.Administrator,
    );
    return userGuildsWhereAdmin;
  }

  private async fetchGuilds(userTokenDetails: string) {
    const [userGuildsWhereAdmin, botGuilds] = await Promise.all([
      this.fetchUserGuildsWhereAdmin(userTokenDetails),
      this.apiProvider.getBotGuilds(),
    ]);
    return { userGuildsWhereAdmin, botGuilds };
  }

  private matchUserToBotGuilds(
    guilds: {
      userGuildsWhereAdmin: RESTGetAPICurrentUserGuildsResult;
      botGuilds: RESTGetAPICurrentUserGuildsResult;
    },
    predicate: UserToBotGuildsPredicate,
  ) {
    const commonGuilds = guilds.userGuildsWhereAdmin.filter((userGuild) =>
      guilds.botGuilds.some((botGuild) => predicate(userGuild.id, botGuild.id)),
    );
    return commonGuilds;
  }
}

type UserToBotGuildsPredicate = (
  userGuildId: string,
  botGuildId: string,
) => boolean;

export const discordApiProvider: Provider = {
  provide: SERVICES.DISCORD_API,
  useClass: DiscordApiService,
};
