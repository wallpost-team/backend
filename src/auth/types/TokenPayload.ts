export type JwtPayload = {
  sub: number;
};

export type Jwt = JwtPayload & {
  iat: number;
  exp: number;
};

export type JwtToRefresh = Jwt & {
  refreshToken: string;
};
