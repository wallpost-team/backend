import { RESTGetAPIGuildChannelsResult } from 'discord-api-types/v10';

export interface IDiscordApiGuildsChannelsService {
  listChannels({
    guildId,
  }: {
    guildId: string;
  }): Promise<RESTGetAPIGuildChannelsResult>;
}
