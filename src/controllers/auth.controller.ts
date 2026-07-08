import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import * as userService from '../services/users.service.js';
import * as userValidation from '../schema/users.validation.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';

export const register = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
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
  };
};

export const login = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
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
  };
};
