import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import * as todoRepository from '../repository/todos.repository.js';
import type { CreateTodoInput, UpdateTodoInput, TodoResponse, PaginationMeta } from '../types/todos.types.js';

export const getTodos = async (
  prisma: PrismaClient,
  userId: string,
  page: number,
  limit: number,
): Promise<{ data: TodoResponse[]; meta: PaginationMeta }> => {
  const skip = (page - 1) * limit;
  const total = await todoRepository.countUserTodos(prisma, userId);
  const data = await todoRepository.findTodosByUser(prisma, userId, skip, limit);

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

export const getTodoById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<TodoResponse> => {
  const todo = await todoRepository.findTodoById(prisma, id, userId);
  if (!todo) {
    throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
  }
  return todo;
};

export const createTodo = async (
  prisma: PrismaClient,
  userId: string,
  input: CreateTodoInput,
): Promise<TodoResponse> => {
  return todoRepository.createTodo(prisma, userId, input);
};

export const updateTodo = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
  input: UpdateTodoInput,
): Promise<TodoResponse> => {
  // Verify ownership
  const existing = await todoRepository.findTodoById(prisma, id, userId);
  if (!existing) {
    throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
  }
  return todoRepository.updateTodo(prisma, id, userId, input);
};

export const deleteTodo = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<void> => {
  return todoRepository.deleteTodoById(prisma, id, userId);
};
