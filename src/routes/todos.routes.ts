import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as todoController from '../controllers/todos.controller.js';

export const createTodosRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.get('/todos', requireAuth(prisma), todoController.todosList(prisma));
  router.post('/todos', requireAuth(prisma), todoController.todosCreate(prisma));
  router.get('/todos/:id', requireAuth(prisma), todoController.todosGetById(prisma));
  router.patch('/todos/:id', requireAuth(prisma), todoController.todosUpdate(prisma));
  router.delete('/todos/:id', requireAuth(prisma), todoController.todosRemove(prisma));

  return router;
};
