import { z } from 'zod';
import { IUser } from '../services/types';

export const User = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  screenName: z.string(),
  avatarUrl: z.string().url(),
});

export const fromUserType = (user: IUser) =>
  User.parse({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    screenName: user.screen_name,
    avatarUrl: user.photo_200,
  });
