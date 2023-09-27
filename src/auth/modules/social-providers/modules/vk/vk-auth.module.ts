import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/app.config';
import authConfig from 'src/auth/auth.config';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { vkAuthProvider } from './auth.service';
import { vkProfileProvider } from './profile.service';
import { VkProfileStrategy } from './profile.strategy';
import { VkAuthController } from './vk-auth.controller';
import vkAuthConfig from './vkAuth.config';

@Module({
  controllers: [VkAuthController],
  imports: [
    PrismaModule,
    EncryptionModule,
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(vkAuthConfig),
    ConfigModule.forFeature(appConfig),
  ],
  providers: [vkAuthProvider, vkProfileProvider, VkProfileStrategy],
  exports: [vkAuthProvider, vkProfileProvider],
})
export class VkAuthModule {}
