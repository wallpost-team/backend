import { User } from '@prisma/client';
import { SignedTokens } from 'src/auth/types';
import { UserDetails } from './types';

export interface IDiscordService {
  validateUser(details: UserDetails): Promise<User>;
  authenticate(user: User): Promise<SignedTokens>;
}
