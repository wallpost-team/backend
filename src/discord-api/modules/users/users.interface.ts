import { DiscordProfile } from '@prisma/client';
import { RESTGetAPICurrentUserResult } from 'discord-api-types/v10';

export interface IDiscordApiUsersService {
  getUsers(
    profile: DiscordProfile,
    ...userIds: string[]
  ): Promise<RESTGetAPICurrentUserResult[]>;
  getUser(
    profile: DiscordProfile,
    userId?: string,
  ): Promise<RESTGetAPICurrentUserResult>;
}
