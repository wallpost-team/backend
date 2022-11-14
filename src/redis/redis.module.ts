import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';

import redisConfig from './redis.config';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
