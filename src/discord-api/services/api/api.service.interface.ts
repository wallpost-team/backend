import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
} from 'discord-api-types/v10';

export interface IDiscordApiService {
  getUser(tokenDetails: string): Promise<RESTGetAPICurrentUserResult>;
  getUserGuilds(
    tokenDetails: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;

  getBotGuilds(): Promise<RESTGetAPICurrentUserGuildsResult>;

  getCommonGuilds(
    tokenDetails: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;
}
