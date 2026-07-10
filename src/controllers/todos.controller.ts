import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import * as todoService from '../services/todos.service.js';
import * as todoValidation from '../schema/todos.validation.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateOrError } from '../utils/validation.js';
import { ApiError } from '../utils/errors.js';

type IdParams = { id: string };

export const list = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '10'), 10)));

      const result = await todoService.getTodos(prisma, userId, page, limit);
      sendSuccess(res, 'Todos retrieved successfully', result.data, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[TODOS_LIST_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

export const getById = (prisma: PrismaClient) => {
  return async (req: Request<IdParams>, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const todo = await todoService.getTodoById(prisma, req.params.id, userId);
      sendSuccess(res, 'Todo retrieved successfully', todo, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[TODOS_GET_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

export const create = (prisma: PrismaClient) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = validateOrError(res, todoValidation.createTodoSchema.safeParse(req.body));
      const todo = await todoService.createTodo(prisma, userId, data);
      sendSuccess(res, 'Todo created successfully', todo, 201);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      if (err instanceof Error && err.message === 'Validation failed - response already sent') return;
      console.error('[TODOS_CREATE_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

export const update = (prisma: PrismaClient) => {
  return async (req: Request<IdParams>, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = validateOrError(res, todoValidation.updateTodoSchema.safeParse(req.body));
      const todo = await todoService.updateTodo(prisma, req.params.id, userId, data);
      sendSuccess(res, 'Todo updated successfully', todo, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      if (err instanceof Error && err.message === 'Validation failed - response already sent') return;
      console.error('[TODOS_UPDATE_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};

export const remove = (prisma: PrismaClient) => {
  return async (req: Request<IdParams>, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      await todoService.deleteTodo(prisma, req.params.id, userId);
      sendSuccess(res, 'Todo deleted successfully', null, 200);
    } catch (err) {
      if (err instanceof ApiError) {
        sendError(res, err.message, err.code, err.status);
        return;
      }
      console.error('[TODOS_DELETE_ERROR]', err);
      sendError(res, 'Internal server error', 'DB_ERROR', 500);
    }
  };
};
