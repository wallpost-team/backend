import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IAuthService } from 'src/auth/services/auth.service.interface';
import { GetUser, SERVICES } from 'src/common';
import { DiscordOAuth2Guard } from './guards/auth.guard';

@Controller('discord')
export class DiscordController {
  constructor(@Inject(SERVICES.AUTH) private readonly auth: IAuthService) {}

  @Get('redirect')
  @UseGuards(DiscordOAuth2Guard)
  async redirect() {
    return;
  }

  @Get('callback')
  @UseGuards(DiscordOAuth2Guard)
  async callback(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    await this.auth.authenticate(user.id, response);
    return user;
  }
}
