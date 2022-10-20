import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { GetUser, SERVICES } from 'src/common';
import { IAuthService } from './auth.service.interface';
import { RefreshTokenGuard } from './guards';
import { JwtToRefresh, SignedTokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private readonly auth: IAuthService) {}

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@GetUser() jwtToRefresh: JwtToRefresh): Promise<SignedTokens> {
    return this.auth.refreshTokens(jwtToRefresh.sub, jwtToRefresh.refreshToken);
  }
}
