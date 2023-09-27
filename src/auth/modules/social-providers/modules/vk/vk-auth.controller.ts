import {
  Controller,
  Get,
  Inject,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/auth/guards';
import { ISocialProviderAuthService } from 'src/auth/modules/social-providers/services/auth.service.interface';
import { GetUser, SERVICES, SignedCookie } from 'src/common';

@ApiTags('Auth', 'VK')
@Controller('vk')
export class VkAuthController {
  constructor(
    @Inject(SERVICES.VK_AUTH)
    private readonly vkAuth: ISocialProviderAuthService,
  ) {}

  @Get('redirect')
  @UseGuards(AccessTokenGuard)
  @Redirect()
  redirect(@Res({ passthrough: true }) response: Response) {
    return { url: this.vkAuth.getAuthorizationUri(response) };
  }

  @Get('callback')
  @UseGuards(AccessTokenGuard)
  @Redirect()
  async callback(
    @Query() query: object,
    @SignedCookie() cookies: object,
    @GetUser() user: User,
  ) {
    await this.vkAuth.authenticate(query, cookies, user);
    return { url: this.vkAuth.okayUri };
  }

  @Get('okay')
  @UseGuards(AccessTokenGuard)
  okay() {
    return;
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@GetUser() user: User) {
    return this.vkAuth.logout(user);
  }
}
