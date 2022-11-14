import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { DiscordModule } from './discord/discord.module';
import { EncryptionModule } from './encryption/encryption.module';

import validationSchema from './validation.schema';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema,
      load: [appConfig],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    RedisModule,
    DiscordModule,
    EncryptionModule,
  ],
})
export class AppModule {}
