import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
} from 'discord-api-types/v10';

export interface IDiscordApiService {
  getUser(tokenDetails: string): Promise<RESTGetAPICurrentUserResult>;
  getGuilds(tokenDetails: string): Promise<{
    manageable: RESTGetAPICurrentUserGuildsResult;
    inviteable: RESTGetAPICurrentUserGuildsResult;
  }>;
  getManageableGuilds(
    tokenDetails: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;
  getInviteableGuilds(
    tokenDetails: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;
}
