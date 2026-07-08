import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/users.controller.js';
import * as authController from '../controllers/auth.controller.js';

export const createUsersRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.get('/users/me', requireAuth(prisma), userController.getMe(prisma));
  router.post('/users/register', authController.register(prisma));
  router.post('/users/login', authController.login(prisma));
  router.delete('/users/logout', requireAuth(prisma), userController.logout(prisma));

  return router;
};
