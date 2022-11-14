import { ulid } from 'ulid';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'redis-om';

import { RedisService } from 'src/redis/redis.service';

import authConfig from '../auth.config';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  SignedTokens,
} from '../types';
import {
  RefreshTokenData,
  RefreshTokenEntity,
  refreshTokenSchema,
} from '../token.entity';
import { Response } from 'express';

@Injectable()
export class TokensService implements OnModuleInit {
  private refreshTokensRepository: Repository<RefreshTokenEntity>;

  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private readonly jwt: JwtService,
    readonly redis: RedisService,
  ) {
    this.refreshTokensRepository = redis.fetchRepository(refreshTokenSchema);
  }

  async onModuleInit() {
    await this.refreshTokensRepository.createIndex();
  }

  async setNewTokens(sub: number, response: Response) {
    const accessTokenPayload = { sub };
    const refreshTokenPayload = { sub, jti: ulid() };

    await this.saveRefreshToken({ jti: refreshTokenPayload.jti });

    const tokens = await this.signTokens(
      accessTokenPayload,
      refreshTokenPayload,
    );
    this.setCookies(response, tokens);
  }

  deleteRefreshToken(id: string) {
    return this.refreshTokensRepository.remove(id);
  }

  getRefreshTokenId(jti: string) {
    return this.refreshTokensRepository.search().where('jti').eq(jti).firstId();
  }

  private async saveRefreshToken(data: RefreshTokenData) {
    const refreshToken = await this.refreshTokensRepository.createAndSave(data);
    await this.refreshTokensRepository.expire(
      refreshToken.entityId,
      this.config.jwtRefreshTTL,
    );
  }

  private async signTokens(
    accessTokenPayload: AccessTokenPayload,
    refreshTokenPayload: RefreshTokenPayload,
  ): Promise<SignedTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookies(response: Response, tokens: SignedTokens): void {
    response.cookie('Authorization', tokens.accessToken, {
      maxAge: this.config.jwtAccessTTL * 1000,
    });
    response.cookie('Refresh', tokens.refreshToken, {
      maxAge: this.config.jwtRefreshTTL * 1000,
    });
  }

  private signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.jwtAccessSecret,
      expiresIn: this.config.jwtAccessTTL,
    });
  }
  private signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.jwtRefreshSecret,
      expiresIn: this.config.jwtRefreshTTL,
    });
  }
}
