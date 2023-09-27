import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SERVICES } from 'src/common';
import { IDiscordApiGuildsChannelsService } from './channels.interface';
import { GuildParamsDto } from '../../dto';

@Controller('channels')
export class DiscordApiGuildsChannelsController {
  constructor(
    @Inject(SERVICES.DISCORD_API_GUILDS_CHANNELS)
    private readonly channels: IDiscordApiGuildsChannelsService,
  ) {}

  @Get()
  list(@Param() guild: GuildParamsDto) {
    return this.channels.listChannels(guild);
  }
}
