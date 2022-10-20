import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'social-providers',
        children: [],
      },
    ]),
  ],
})
export class SocialProvidersModule {}
