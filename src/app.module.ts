import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { DiscordApiModule } from './discord-api/discord-api.module';
import { EncryptionModule } from './encryption/encryption.module';

import validationSchema from './validation.schema';
import appConfig from './app.config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
