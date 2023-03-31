import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
} from 'discord-api-types/v10';

export interface IDiscordApiProviderService {
  getUser(tokenDetails: string): Promise<RESTGetAPICurrentUserResult>;
  getUserGuilds(
    tokenDetails: string,
  ): Promise<RESTGetAPICurrentUserGuildsResult>;

  getBotGuilds(): Promise<RESTGetAPICurrentUserGuildsResult>;
}
