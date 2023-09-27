import { DiscordProfile } from '@prisma/client';
import { RESTGetAPIChannelResult } from 'discord-api-types/v10';

export interface IDiscordApiChannelsService {
  getChannels(
    profile: DiscordProfile,
    ...channelIds: string[]
  ): Promise<RESTGetAPIChannelResult[]>;
  getChannel(
    profile: DiscordProfile,
    channelId: string,
  ): Promise<RESTGetAPIChannelResult>;
}
