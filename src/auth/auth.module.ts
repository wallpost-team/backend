import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { DiscordModule, SocialProvidersModule } from './modules';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

import authConfig from './auth.config';
import { authProvider } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    RouterModule.register([
      {
        path: 'auth',
        children: [DiscordModule, SocialProvidersModule],
      },
    ]),
    PassportModule.register({}),
    JwtModule.register({}),
    DiscordModule,
    SocialProvidersModule,
    UserModule,
  ],
  providers: [authProvider, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [authProvider],
  controllers: [AuthController],
})
export class AuthModule {}
