import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/users.controller.js';
import * as userValidation from '../schema/users.validation.js';
import * as userService from '../services/users.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';
import type { Request, Response } from 'express';

export const createUsersRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.post('/users/register', async (req: Request, res: Response) => {
    try {
      const parsed = userValidation.registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(', ');
        sendError(res, messages, 'INVALID_INPUT');
        return;
      }
      const result = await userService.registerUser(prisma, parsed.data);
      sendSuccess(res, 'User registered successfully', result, 201);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[REGISTER_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  });

  router.post('/users/login', async (req: Request, res: Response) => {
    try {
      const parsed = userValidation.loginSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(', ');
        sendError(res, messages, 'INVALID_INPUT');
        return;
      }
      const result = await userService.loginUser(prisma, parsed.data);
      sendSuccess(res, 'Login successful', result, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[LOGIN_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  });

  router.delete('/users/logout', requireAuth(prisma), userController.logout(prisma));

  return router;
};
