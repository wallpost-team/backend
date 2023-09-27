import { Module } from '@nestjs/common';
import { vkApiProvider } from './services/vk-api.service';
import { VkApiController } from './vk-api.controller';
import { VkAuthModule } from 'src/auth/modules/social-providers/modules/vk/vk-auth.module';

@Module({
  imports: [VkAuthModule],
  controllers: [VkApiController],
  providers: [vkApiProvider],
  exports: [vkApiProvider],
})
export class VkApiModule {}
