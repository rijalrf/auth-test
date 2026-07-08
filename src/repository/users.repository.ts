import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';

export const deleteUserSession = async (prisma: PrismaClient, userId: string): Promise<boolean> => {
  try {
    const result = await prisma.session.deleteMany({ where: { userId } });
    return result.count > 0;
  } catch (err) {
    throw new ApiError(
      'Failed to delete session',
      'DB_DELETE_SESSION_ERROR',
      500,
    );
  }
};
