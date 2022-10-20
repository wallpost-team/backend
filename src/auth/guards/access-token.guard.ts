import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common';

export class AccessTokenGuard extends AuthGuard(AUTH_STRATEGIES.JWT_ACCESS) {}
