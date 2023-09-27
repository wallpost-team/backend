import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import appConfig from './app.config';
import { AuthModule } from './auth/auth.module';
import { DiscordApiModule } from './discord-api/discord-api.module';
import { EncryptionModule } from './encryption/encryption.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import validationSchema from './validation.schema';
import { VkApiModule } from './vk-api/vk-api.module';
import { GuildsModule } from './guilds/guilds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema,
      load: [appConfig],
      expandVariables: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    RedisModule,
    DiscordApiModule,
    EncryptionModule,
    VkApiModule,
    GuildsModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
