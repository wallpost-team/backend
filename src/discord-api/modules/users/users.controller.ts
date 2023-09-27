import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { DiscordProfileGuard } from 'src/auth/modules/discord/profile.guard';
import { GetUser, SERVICES } from 'src/common';
import { IDiscordApiUsersService } from './users.interface';
import { DiscordProfile } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discord')
@Controller()
@UseGuards(DiscordProfileGuard)
export class DiscordApiUsersController {
  constructor(
    @Inject(SERVICES.DISCORD_API_USERS)
    private readonly api: IDiscordApiUsersService,
  ) {}

  @Get('me')
  getMe(@GetUser() profile: DiscordProfile) {
    return this.api.getUser(profile);
  }
}
