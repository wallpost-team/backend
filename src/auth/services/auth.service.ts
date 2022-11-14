import { Injectable, Provider } from '@nestjs/common';
import { Response } from 'express';

import { SERVICES } from 'src/common';

import { IAuthService } from './auth.service.interface';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly tokens: TokensService) {}

  authenticate(sub: number, response: Response): Promise<void> {
    console.log(sub);
    return this.tokens.setNewTokens(sub, response);
  }

  refreshTokens(sub: number, response: Response): Promise<void> {
    return this.tokens.setNewTokens(sub, response);
  }
}

export const authProvider: Provider = {
  provide: SERVICES.AUTH,
  useClass: AuthService,
};
