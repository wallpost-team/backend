import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { DiscordProfile } from '@prisma/client';
import { DiscordProfileGuard } from 'src/auth/modules/discord/guards/profile.guard';
import { GetUser, SERVICES } from 'src/common';
import { IDiscordApiService } from './services/api/api.service.interface';

@Controller('discord')
export class DiscordApiController {
  constructor(
    @Inject(SERVICES.DISCORD_API) private readonly discord: IDiscordApiService,
  ) {}

  @Get('user')
  @UseGuards(DiscordProfileGuard)
  getUser(@GetUser() discordProfile: DiscordProfile) {
    return this.discord.getUser(discordProfile.tokenDetails);
  }

  @Get('user/guilds')
  @UseGuards(DiscordProfileGuard)
  getUserGuilds(@GetUser() discordProfile: DiscordProfile) {
    return this.discord.getUserGuilds(discordProfile.tokenDetails);
  }

  @Get('user/guilds/common')
  @UseGuards(DiscordProfileGuard)
  getUserGuildsCommon(@GetUser() discordProfile: DiscordProfile) {
    return this.discord.getCommonGuilds(discordProfile.tokenDetails);
  }
}
