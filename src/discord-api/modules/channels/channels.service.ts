import { Injectable, Provider } from '@nestjs/common';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { IDiscordApiChannelsService } from './channels.interface';
import { DiscordProfile } from '@prisma/client';
import { SERVICES } from 'src/common';

@Injectable()
export class DiscordApiChannelsService
  extends DiscordApiService
  implements IDiscordApiChannelsService
{
  async getChannels(profile: DiscordProfile, ...channelIds: string[]) {
    const api = await this.getApi(profile);
    return Promise.all(
      channelIds.map((channelId) => api.getChannel(channelId)),
    );
  }
  async getChannel(profile: DiscordProfile, channelId: string) {
    return this.getChannels(profile, channelId).then((channels) => channels[0]);
  }
}

export const discordApiChannelsProvider: Provider = {
  provide: SERVICES.DISCORD_API_CHANNELS,
  useClass: DiscordApiChannelsService,
};
