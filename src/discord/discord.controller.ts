import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';
import { GetUser } from 'src/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discord: DiscordService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMe(@GetUser() user) {
    return;
  }
}
