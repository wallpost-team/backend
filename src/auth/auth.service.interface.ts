import { User } from '@prisma/client';
import { SignedTokens, JwtPayload } from './types';

export interface IAuthService {
  authenticate(user: User): Promise<SignedTokens>;
  refreshTokens(userId: number, refreshToken: string): Promise<SignedTokens>;
}
