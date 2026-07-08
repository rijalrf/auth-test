import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import * as userService from '../services/users.service.js';
import * as userValidation from '../schema/users.validation.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const createUsersRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.post('/users/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = userValidation.registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(', ');
        sendError(res, messages, 'INVALID_INPUT');
        return;
      }

      const result = await userService.registerUser(prisma, parsed.data);
      sendSuccess(res, 'User registered successfully', result, 201);
    } catch (err: any) {
      if (err.code === 'USER_EMAIL_EXISTS') {
        sendError(res, err.message, 'USER_EMAIL_EXISTS', 409);
        return;
      }
      if (err.code === 'PASSWORD_HASH_ERROR') {
        sendError(res, err.message, 'PASSWORD_HASH_ERROR', 500);
        return;
      }
      console.error('[REGISTER_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  });

  return router;
};
