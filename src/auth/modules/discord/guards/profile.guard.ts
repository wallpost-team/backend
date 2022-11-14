import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common';

export class DiscordOAuth2Guard extends AuthGuard(
  AUTH_STRATEGIES.DISCORD_PROFILE,
) {}
