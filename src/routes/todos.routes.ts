import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as todoController from '../controllers/todos.controller.js';

export const createTodosRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.get('/todos', requireAuth(prisma), todoController.list(prisma));
  router.post('/todos', requireAuth(prisma), todoController.create(prisma));
  router.get('/todos/:id', requireAuth(prisma), todoController.getById(prisma));
  router.put('/todos/:id', requireAuth(prisma), todoController.update(prisma));
  router.delete('/todos/:id', requireAuth(prisma), todoController.remove(prisma));

  return router;
};
