import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';

export const requireAuth = (prisma: PrismaClient) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        sendError(res, 'Unauthorized — no token provided', 'UNAUTHORIZED', 401);
        return;
      }

      const token = header.slice(7);
      const session = await prisma.session.findUnique({ where: { token } });

      if (!session || session.expiresAt < new Date()) {
        sendError(res, 'Unauthorized — invalid or expired token', 'UNAUTHORIZED', 401);
        return;
      }

      req.userId = session.userId;
      next();
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[AUTH_ERROR]', err);
      sendError(res, 'Internal server error', 'AUTH_ERROR', 500);
    }
  };
};
