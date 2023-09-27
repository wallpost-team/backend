import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from 'src/app.config';
import { AuthModule } from 'src/auth/auth.module';
import { DiscordApiModule } from 'src/discord-api/discord-api.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import authConfig from 'src/auth/auth.config';
import { DiscordAuthController } from './discord-auth.controller';
import discordAuthConfig from './discordAuth.config';
import { DiscordProfileStrategy } from './profile.strategy';
import { discordAuthProvider } from './services/auth/auth.service';
import { discordProfileProvider } from './services/profile/profile.service';

@Module({
  imports: [
    PrismaModule,
    EncryptionModule,
    forwardRef(() => AuthModule),
    // forwardRef(() => DiscordApiModule),
    // forwardRef(() => DiscordApiModule),
    ConfigModule.forFeature(discordAuthConfig),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [DiscordAuthController],
  providers: [
    discordAuthProvider,
    DiscordProfileStrategy,
    discordProfileProvider,
  ],
  exports: [discordProfileProvider, discordAuthProvider],
})
export class DiscordAuthModule {}
