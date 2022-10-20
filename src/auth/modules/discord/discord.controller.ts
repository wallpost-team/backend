import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser, SERVICES } from 'src/common';
import { DiscordOAuth2Guard } from './discord.guard';
import { IDiscordService } from './discord.service.interface';

@Controller('discord')
export class DiscordController {
  constructor(
    @Inject(SERVICES.DISCORD_AUTH) private readonly discord: IDiscordService,
  ) {}

  @Get('redirect')
  @UseGuards(DiscordOAuth2Guard)
  async redirect() {
    return;
  }

  @Get('callback')
  @UseGuards(DiscordOAuth2Guard)
  async callback(@GetUser() user: User) {
    return this.discord.authenticate(user);
  }
}
