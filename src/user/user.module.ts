import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { userProvider } from './user.service';
import { UserController } from './user.controller';
import { VkApiModule } from 'src/vk-api/vk-api.module';

@Module({
  imports: [PrismaModule, VkApiModule],
  providers: [userProvider],
  exports: [userProvider],
  controllers: [UserController],
})
export class UserModule {}
