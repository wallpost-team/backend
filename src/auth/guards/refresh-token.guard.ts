import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common';

export class RefreshTokenGuard extends AuthGuard(AUTH_STRATEGIES.JWT_REFRESH) {}
