import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import * as userService from '../services/users.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';

export const getMe = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }
      const user = await userService.getCurrentUserInfo(prisma, userId);
      sendSuccess(res, 'User profile retrieved successfully', user, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[GET_ME_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

export const logout = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }
      const result = await userService.logoutUser(prisma, userId);
      sendSuccess(res, 'Logout successful', result, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[LOGOUT_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};
