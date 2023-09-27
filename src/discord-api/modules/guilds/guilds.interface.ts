import { DiscordProfile } from '@prisma/client';
import { RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/v10';

export interface IDiscordApiGuildsService {
  list(profile: DiscordProfile): Promise<{
    manageable: RESTGetAPICurrentUserGuildsResult;
    inviteable: RESTGetAPICurrentUserGuildsResult;
  }>;
  listManageable(
    profile: DiscordProfile,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;
  listInviteable(
    profile: DiscordProfile,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;
}
