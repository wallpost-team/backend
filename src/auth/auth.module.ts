import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';

import authConfig from './auth.config';
import { AuthController } from './auth.controller';
import { DiscordAuthModule, SocialProvidersModule } from './modules';
import { routes as socialProvidersRoutes } from './modules/social-providers/social-providers.routes';
import { authProvider } from './services/auth.service';
import { TokensService } from './services/tokens.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    RouterModule.register([
      {
        path: 'auth',
        children: [
          { path: '/', module: DiscordAuthModule },
          socialProvidersRoutes,
        ],
      },
    ]),
    PassportModule.register({}),
    JwtModule.register({}),
    forwardRef(() => DiscordAuthModule),
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
