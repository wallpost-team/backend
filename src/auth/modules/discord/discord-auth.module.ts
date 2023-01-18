import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';

import appConfig from 'src/app.config';
import authConfig from 'src/auth/auth.config';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { DiscordApiModule } from 'src/discord-api/discord-api.module';

import discordAuthConfig from './discordAuth.config';
import { DiscordController } from './discord-auth.controller';
import { discordAuthProvider } from './services/auth/auth.service';
import { discordProfileProvider } from './services/profile/profile.service';
import { DiscordProfileStrategy } from './strategies/profile.strategy';

@Module({
  imports: [
    PrismaModule,
    EncryptionModule,
    forwardRef(() => AuthModule),
    forwardRef(() => DiscordApiModule),
    // forwardRef(() => DiscordApiModule),
    ConfigModule.forFeature(discordAuthConfig),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [DiscordController],
  providers: [
    // DiscordAuthStrategy,
    discordAuthProvider,
    DiscordProfileStrategy,
    discordProfileProvider,
  ],
  exports: [discordProfileProvider, discordAuthProvider],
})
export class DiscordAuthModule {}
