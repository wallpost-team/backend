import { Response } from 'express';

export interface IAuthService {
  authenticate(sub: number, response: Response): Promise<void>;
  refreshTokens(sub: number, response: Response): Promise<void>;
}
