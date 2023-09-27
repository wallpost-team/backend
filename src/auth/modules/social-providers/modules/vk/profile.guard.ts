import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common';

export class VkProfileGuard extends AuthGuard(AUTH_STRATEGIES.VK_PROFILE) {}
