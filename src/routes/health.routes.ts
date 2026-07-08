import { Router } from 'express';
import * as healthController from '../controllers/health.controller.js';

export const createHealthRouter = (): Router => {
  const router = Router();
  router.get('/health', healthController.getHealth());
  return router;
};
