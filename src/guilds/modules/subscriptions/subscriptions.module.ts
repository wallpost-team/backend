import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionsController } from './subscriptions.controller';
import { subscriptionsProvider } from './subscriptions.service';
import { VkApiModule } from 'src/vk-api/vk-api.module';
import { DiscordApiUsersModule } from 'src/discord-api/modules';
import { DiscordApiChannelsModule } from 'src/discord-api/modules/channels/channels.module';
import { DiscordApiModule } from 'src/discord-api/discord-api.module';

@Module({
  imports: [
    PrismaModule,
    VkApiModule,
    DiscordApiModule,
    DiscordApiUsersModule,
    DiscordApiChannelsModule,
  ],
  controllers: [SubscriptionsController],
  providers: [subscriptionsProvider],
})
export class SubscriptionsModule {}
