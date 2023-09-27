import { Module } from '@nestjs/common';
import { VkModule } from './modules';

@Module({
  imports: [VkModule],
})
export class SocialProvidersModule {}
