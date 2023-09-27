import { Injectable, Provider } from '@nestjs/common';
import { DiscordProfile } from '@prisma/client';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { IDiscordApiGuildsChannelsService } from './channels.interface';
import { SERVICES } from 'src/common';

@Injectable()
export class DiscordApiGuildsChannelsService
  extends DiscordApiService
  implements IDiscordApiGuildsChannelsService
{
  async listChannels({ guildId }: { guildId: string }) {
    const api = await this.getApi();
    return api.listGuildChannels(guildId);
  }
}

export const discordApiGuildsChannelsProvider: Provider = {
  provide: SERVICES.DISCORD_API_GUILDS_CHANNELS,
  useClass: DiscordApiGuildsChannelsService,
};
