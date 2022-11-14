export type AccessTokenPayload = {
  sub: number;
};

export type RefreshTokenPayload = AccessTokenPayload & {
  jti: string;
};

type TokenBase = {
  iat: number;
  exp: number;
};

export type AccessToken = AccessTokenPayload & TokenBase;

export type RefreshToken = RefreshTokenPayload & TokenBase;
