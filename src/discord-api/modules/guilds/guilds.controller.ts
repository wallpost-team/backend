import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { DiscordProfile } from '@prisma/client';
import { DiscordProfileGuard } from 'src/auth/modules/discord/profile.guard';
import { GetUser, SERVICES } from 'src/common';
import { IDiscordApiGuildsService } from './guilds.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discord')
@Controller()
@UseGuards(DiscordProfileGuard)
export class DiscordApiGuildsController {
  constructor(
    @Inject(SERVICES.DISCORD_API_GUILDS)
    private readonly api: IDiscordApiGuildsService,
  ) {}

  @Get()
  list(@GetUser() profile: DiscordProfile) {
    return this.api.list(profile);
  }

  @Get('manageable')
  listManageable(@GetUser() profile: DiscordProfile) {
    return this.api.listManageable(profile);
  }

  @Get('inviteable')
  listInviteable(@GetUser() profile: DiscordProfile) {
    return this.api.listInviteable(profile);
  }
}
