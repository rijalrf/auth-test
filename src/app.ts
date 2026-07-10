import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/client.js';
import { createHealthRouter } from './routes/health.routes.js';
import { createUsersRouter } from './routes/users.routes.js';
import { createTodosRouter } from './routes/todos.routes.js';

export const createApp = (prisma: PrismaClient) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api', createHealthRouter());
  app.use('/api', createUsersRouter(prisma));
  app.use('/api', createTodosRouter(prisma));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};
