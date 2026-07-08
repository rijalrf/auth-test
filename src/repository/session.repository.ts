import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';

/**
 * Delete all sessions for a user (logout).
 * Idempotent: returns boolean if any rows deleted.
 */
export const deleteUserSession = async (prisma: PrismaClient, userId: string): Promise<boolean> => {
  try {
    const result = await prisma.session.deleteMany({ where: { userId } });
    return result.count > 0;
  } catch (err) {
    throw new ApiError('Failed to delete session', 'DB_DELETE_SESSION_ERROR', 500);
  }
};

/**
 * Find a session by its token.
 * Returns null if not found.
 */
export const findSessionByToken = async (prisma: PrismaClient, token: string) => {
  try {
    const session = await prisma.session.findUnique({ where: { token } });
    return session;
  } catch (err) {
    throw new ApiError('Failed to validate session', 'DB_SESSION_LOOKUP_ERROR', 500);
  }
};

/**
 * Create a new session for a user with expiry.
 */
export const createUserSession = async (prisma: PrismaClient, userId: string, expiresAt: Date) => {
  try {
    const session = await prisma.session.create({
      data: { userId, expiresAt },
    });
    return session;
  } catch (err) {
    throw new ApiError('Failed to create session', 'DB_SESSION_CREATE_ERROR', 500);
  }
};
