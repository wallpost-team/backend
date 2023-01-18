import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { GetUser, SERVICES } from 'src/common';
import { IAuthService } from './services/auth.service.interface';
import { RefreshTokenGuard } from './guards';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private readonly auth: IAuthService) {}

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({
    description: 'Successfully refreshed tokens.',
    headers: {
      'Set-Cookie': {
        description: 'Access token',
        schema: {
          type: 'string',
          example: 'Authorization=asd.asd.asd; Path=/; HttpOnly',
        },
      },
      '\0Set-Cookie': {
        description: 'Refresh token',
        schema: {
          type: 'string',
          example: 'Refresh=asd.asd.asd; Path=/; HttpOnly',
        },
      },
    },
  })
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    await this.auth.refreshTokens(user.id, response);
    return user;
  }
}
