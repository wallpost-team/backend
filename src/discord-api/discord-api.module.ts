import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DiscordAuthModule } from 'src/auth/modules/discord/discord-auth.module';

import discordConfig from './discord-api.config';
import { DiscordApiController } from './discord-api.controller';
import { discordApiProvider } from './services/api/api.service';
import { discordApiClientProvider } from './services/client/client.service';

@Module({
  imports: [
    forwardRef(() => DiscordAuthModule),
    ConfigModule.forFeature(discordConfig),
  ],
  providers: [discordApiProvider, discordApiClientProvider],
  controllers: [DiscordApiController],
  exports: [discordApiProvider, discordApiClientProvider],
})
export class DiscordApiModule {}
