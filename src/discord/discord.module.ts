import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import discordConfig from './discord.config';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';

@Module({
  imports: [ConfigModule.forFeature(discordConfig)],
  providers: [DiscordService],
  controllers: [DiscordController],
})
export class DiscordModule {}
