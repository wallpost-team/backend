import { Module } from '@nestjs/common';
import { discordApiChannelsProvider } from './channels.service';
import { DiscordAuthModule } from 'src/auth/modules';
import { ConfigModule } from '@nestjs/config';
import discordApiConfig from 'src/discord-api/discord-api.config';

@Module({
  imports: [DiscordAuthModule, ConfigModule.forFeature(discordApiConfig)],
  providers: [discordApiChannelsProvider],
  exports: [discordApiChannelsProvider],
})
export class DiscordApiChannelsModule {}
