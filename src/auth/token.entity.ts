import { Entity, Schema } from 'redis-om';

export type RefreshTokenData = {
  jti: string;
};

export class RefreshTokenEntity extends Entity {}

export const refreshTokenSchema = new Schema(RefreshTokenEntity, {
  jti: { type: 'string' },
});
