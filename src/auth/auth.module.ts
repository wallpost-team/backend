import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';

import authConfig from './auth.config';
import { DiscordModule, SocialProvidersModule } from './modules';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { authProvider } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TokensService } from './services/tokens.service';

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
    RedisModule,
  ],
  providers: [
    authProvider,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    TokensService,
  ],
  exports: [authProvider],
  controllers: [AuthController],
})
export class AuthModule {}
