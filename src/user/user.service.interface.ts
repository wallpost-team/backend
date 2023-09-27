import { Prisma, User } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { Wall } from 'src/vk-api/entities';

export interface IUserService {
  create(data: Prisma.UserCreateInput): Promise<User>;
  get(where: Prisma.UserWhereInput): Promise<User>;
  find(where: Prisma.UserWhereUniqueInput): Promise<User | null>;
  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User>;
  upsert(
    create: Prisma.UserCreateInput,
    update: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User>;

  listSocialProfiles(user: User): Promise<z.infer<typeof Wall>[]>;
}
