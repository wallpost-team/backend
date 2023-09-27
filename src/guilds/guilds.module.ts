import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SubscriptionsModule } from './modules';

@Module({
  imports: [
    SubscriptionsModule,
    RouterModule.register([
      {
        path: 'guilds',
        children: [
          {
            path: ':guildId',
            children: [SubscriptionsModule],
          },
        ],
      },
    ]),
  ],
})
export class GuildsModule {}
