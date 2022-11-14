import { User } from '@prisma/client';

export function discordApiCall(
  target: object,
  key: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (user: User, ...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      throw error;
    }
  };

  return descriptor;
}
