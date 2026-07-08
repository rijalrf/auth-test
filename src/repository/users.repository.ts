import { PrismaClient } from '../generated/prisma/client.js';

export const deleteUserSession = async (prisma: PrismaClient, userId: string): Promise<boolean> => {
  const result = await prisma.session.deleteMany({ where: { userId } });
  return result.count > 0;
};
