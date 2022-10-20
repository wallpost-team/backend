import { Prisma, User } from '@prisma/client';

export interface IUserService {
  create(data: Prisma.UserCreateInput): Promise<User>;
  get(where: Prisma.UserWhereInput): Promise<User | never>;
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
}
