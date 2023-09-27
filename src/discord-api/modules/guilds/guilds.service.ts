import { DiscordProfile } from '@prisma/client';
import {
  PermissionFlagsBits,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPICurrentUserGuildsResult,
} from 'discord-api-types/v10';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { IDiscordApiGuildsService } from './guilds.interface';
import { Provider } from '@nestjs/common';
import { SERVICES } from 'src/common';

export class DiscordApiGuildsService
  extends DiscordApiService
  implements IDiscordApiGuildsService
{
  async list(profile: DiscordProfile) {
    const guilds = await this.fetchGuilds(profile);
    const manageable = this.matchUserToBotGuilds(guilds, isGuildManageable);
    const inviteable = this.matchUserToBotGuilds(guilds, isGuildInviteable);
    return { manageable, inviteable };
  }

  async listManageable(profile: DiscordProfile) {
    const guilds = await this.fetchGuilds(profile);
    return this.matchUserToBotGuilds(guilds, isGuildManageable);
  }

  async listInviteable(profile: DiscordProfile) {
    const guilds = await this.fetchGuilds(profile);
    return this.matchUserToBotGuilds(guilds, isGuildInviteable);
  }

  private async fetchGuilds(profile: DiscordProfile) {
    const [userGuilds, botGuilds] = await Promise.all([
      this.fetchUserGuilds(profile),
      this.fetchBotGuilds(),
    ]);

    const userGuildsWhereAdmin = userGuilds.filter(isUserGuildAdmin);

    return { userGuildsWhereAdmin, botGuilds };
  }

  private async fetchUserGuilds(profile: DiscordProfile) {
    const api = await this.getApi(profile);
    return api.listUserGuilds();
  }

  private async fetchBotGuilds() {
    const api = await this.getApi();
    return api.listUserGuilds();
  }

  private matchUserToBotGuilds(
    guilds: {
      userGuildsWhereAdmin: RESTGetAPICurrentUserGuildsResult;
      botGuilds: RESTGetAPICurrentUserGuildsResult;
    },
    predicate: UserToBotGuildsPredicate,
  ) {
    const commonGuilds = guilds.userGuildsWhereAdmin.filter((userGuild) =>
      guilds.botGuilds.some((botGuild) => predicate(userGuild, botGuild)),
    );
    return commonGuilds;
  }
}

const isUserGuildAdmin = ({ permissions }: RESTAPIPartialCurrentUserGuild) =>
  (BigInt(permissions) & PermissionFlagsBits.Administrator) ===
  PermissionFlagsBits.Administrator;

type UserToBotGuildsPredicate = (
  userGuild: RESTAPIPartialCurrentUserGuild,
  botGuild: RESTAPIPartialCurrentUserGuild,
) => boolean;

const isGuildManageable: UserToBotGuildsPredicate = ({ id: u }, { id: b }) =>
  u === b;

const isGuildInviteable: UserToBotGuildsPredicate = ({ id: u }, { id: b }) =>
  u !== b;

export const discordApiGuildsProvider: Provider = {
  provide: SERVICES.DISCORD_API_GUILDS,
  useClass: DiscordApiGuildsService,
};
