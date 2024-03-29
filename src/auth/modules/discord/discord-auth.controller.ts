import { Controller, Get, Inject, Query, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { IAuthService } from 'src/auth/services/auth.service.interface';
import { SERVICES, SignedCookie } from 'src/common';
import { IDiscordAuthService } from './services/auth/auth.service.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth', 'Discord')
@Controller('discord')
export class DiscordAuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly auth: IAuthService,
    @Inject(SERVICES.DISCORD_AUTH)
    private readonly discordAuth: IDiscordAuthService,
  ) {}

  @Get('redirect')
  @Redirect()
  redirect(@Res({ passthrough: true }) response: Response) {
    return { url: this.discordAuth.getAuthorizationUri(response) };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Query() query: object,
    @SignedCookie() cookies: object,
    @Res({ passthrough: true }) response: Response,
  ) {
    const discordProfile = await this.discordAuth.authenticate(query, cookies);
    await this.auth.authenticate(discordProfile.user.id, response);
    return { url: this.discordAuth.getOkayUri() };
  }

  @Get('okay')
  okay() {
    return;
  }
}
