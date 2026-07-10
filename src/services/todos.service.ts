import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import * as todoRepo from '../repository/todos.repository.js';
import type { TCreateTodoInput, TUpdateTodoInput, TTodoResponse, TPaginationMeta } from '../types/todos.types.js';

export const todosGetMany = async (
  prisma: PrismaClient,
  userId: string,
  page: number,
  limit: number,
): Promise<{ data: TTodoResponse[]; meta: TPaginationMeta }> => {
  const skip = (page - 1) * limit;
  const total = await todoRepo.todosCount(prisma, userId);
  const data = await todoRepo.todosFindMany(prisma, userId, skip, limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const todosGetById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<TTodoResponse> => {
  const todo = await todoRepo.todosFindById(prisma, id, userId);
  if (!todo) {
    throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
  }
  return todo;
};

export const todosCreate = async (
  prisma: PrismaClient,
  userId: string,
  input: TCreateTodoInput,
): Promise<TTodoResponse> => {
  return todoRepo.todosCreate(prisma, userId, input);
};

export const todosUpdate = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
  input: TUpdateTodoInput,
): Promise<TTodoResponse> => {
  const existing = await todoRepo.todosFindById(prisma, id, userId);
  if (!existing) {
    throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
  }
  return todoRepo.todosUpdate(prisma, id, input);
};

export const todosDelete = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<void> => {
  return todoRepo.todosDelete(prisma, id, userId);
};
