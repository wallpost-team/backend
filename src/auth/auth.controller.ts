import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { GetUser, SERVICES } from 'src/common';
import { IAuthService } from './services/auth.service.interface';
import { RefreshTokenGuard } from './guards';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private readonly auth: IAuthService) {}

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    await this.auth.refreshTokens(user.id, response);
    return user;
  }
}
