import { Injectable, Provider } from '@nestjs/common';
import { DiscordProfile } from '@prisma/client';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { IDiscordApiUsersService } from './users.interface';
import { SERVICES } from 'src/common';
import { RESTGetAPICurrentUserResult } from 'discord-api-types/v10';

@Injectable()
export class DiscordApiUsersService
  extends DiscordApiService
  implements IDiscordApiUsersService
{
  async getUsers(
    profile: DiscordProfile,
    ...userIds: string[]
  ): Promise<RESTGetAPICurrentUserResult[]> {
    const api = await this.getApi(profile);
    return Promise.all(userIds.map((userId) => api.getUser(userId)));
  }

  async getUser(
    profile: DiscordProfile,
    userId = '@me',
  ): Promise<RESTGetAPICurrentUserResult> {
    return this.getUsers(profile, userId).then((users) => users[0]);
  }
}

export const discordApiUsersProvider: Provider = {
  provide: SERVICES.DISCORD_API_USERS,
  useClass: DiscordApiUsersService,
};
