import { RouteTree } from '@nestjs/core';
import { VkModule } from './modules';
import { SocialProvidersModule } from './social-providers.module';

export const routes: RouteTree = {
  path: 'social-providers',
  module: SocialProvidersModule,
  children: [VkModule],
};
