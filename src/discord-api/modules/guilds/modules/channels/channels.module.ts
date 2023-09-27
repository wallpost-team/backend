import { Module } from '@nestjs/common';
import { discordApiGuildsChannelsProvider } from './channels.service';
import { DiscordAuthModule } from 'src/auth/modules';
import { ConfigModule } from '@nestjs/config';
import discordApiConfig from 'src/discord-api/discord-api.config';
import { DiscordApiGuildsChannelsController } from './channels.controller';

@Module({
  imports: [DiscordAuthModule, ConfigModule.forFeature(discordApiConfig)],
  providers: [discordApiGuildsChannelsProvider],
  controllers: [DiscordApiGuildsChannelsController],
})
export class DiscordApiGuildsChannelsModule {}
