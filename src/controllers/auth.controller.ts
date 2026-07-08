import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import * as userService from '../services/users.service.js';
import * as userValidation from '../schema/users.validation.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateOrError } from '../utils/validation.js';
import { ApiError } from '../utils/errors.js';

/**
 * Handle user registration request.
 * Validates input → calls registerUser service → returns user data.
 */
export const register = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const data = validateOrError(res, userValidation.registerSchema.safeParse(req.body));
      const result = await userService.registerUser(prisma, data);
      sendSuccess(res, 'User registered successfully', result, 201);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      // Re-throw errors from validateOrError that already sent response
      if (err instanceof Error && err.message === 'Validation failed - response already sent') return;
      console.error('[REGISTER_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

/**
 * Handle user login request.
 * Validates credentials → creates session → returns user + token.
 */
export const login = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const data = validateOrError(res, userValidation.loginSchema.safeParse(req.body));
      const result = await userService.loginUser(prisma, data);
      sendSuccess(res, 'Login successful', result, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      if (err instanceof Error && err.message === 'Validation failed - response already sent') return;
      console.error('[LOGIN_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};
