import argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { SERVICES } from 'src/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  upsert(
    create: Prisma.UserCreateInput,
    update: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.prisma.user.upsert({ create, update, where });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  get(where: Prisma.UserWhereUniqueInput): Promise<User | never> {
    return this.prisma.user.findFirstOrThrow({ where });
  }

  find(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({ where, data });
  }
}

export const userProvider = {
  provide: SERVICES.USER,
  useClass: UserService,
};
