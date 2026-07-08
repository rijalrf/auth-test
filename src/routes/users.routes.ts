import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../generated/prisma/client.js';
import { createUserService } from '../services/users.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const createUsersRouter = (prisma: PrismaClient): Router => {
  const router = Router();
  const { registerUser } = createUserService(prisma);

  router.post('/users/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(', ');
        sendError(res, messages, 400, 'INVALID_INPUT');
        return;
      }

      const result = await registerUser(parsed.data);
      sendSuccess(res, 'User registered successfully', result, 201);
    } catch (err: any) {
      if (err.code === 'USER_EMAIL_EXISTS') {
        sendError(res, err.message, 409, 'USER_EMAIL_EXISTS');
        return;
      }
      console.error('[REGISTER_ERROR]', err);
      sendError(res, 'Internal server error', 500, 'DB_ERROR');
    }
  });

  return router;
};
