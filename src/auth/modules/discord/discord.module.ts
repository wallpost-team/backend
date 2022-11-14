import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

import discordConfig from './discordAuth.config';
import { DiscordController } from './discord.controller';
import { discordAuthProvider } from './services/auth/auth.service';
import { DiscordStrategy } from './strategies/auth.strategy';
import { DiscordProfileService } from './services/profile/profile.service';
import { DiscordAuthService } from './services/auth/auth.service';

@Module({
  imports: [
    UserModule,
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(discordConfig),
  ],
  controllers: [DiscordController],
  providers: [
    DiscordStrategy,
    discordAuthProvider,
    DiscordProfileService,
    DiscordAuthService,
  ],
})
export class DiscordModule {}
