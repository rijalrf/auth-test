import { PrismaClient } from '../generated/prisma/client.js';
import type { UserProfile } from '../types/users.types.js';

export const getUserById = async (prisma: PrismaClient, userId: string): Promise<UserProfile | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  return user;
};
