import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import type { CreateTodoInput, UpdateTodoInput, TodoResponse } from '../types/todos.types.js';

export const countUserTodos = async (prisma: PrismaClient, userId: string): Promise<number> => {
  try {
    return await prisma.todo.count({ where: { userId } });
  } catch {
    throw new ApiError('Failed to count todos', 'DB_TODO_COUNT_ERROR', 500);
  }
};

export const findTodosByUser = async (
  prisma: PrismaClient,
  userId: string,
  skip: number,
  take: number,
): Promise<TodoResponse[]> => {
  try {
    return await prisma.todo.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    throw new ApiError('Failed to fetch todos', 'DB_TODO_FETCH_ERROR', 500);
  }
};

export const findTodoById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<TodoResponse | null> => {
  try {
    return await prisma.todo.findFirst({
      where: { id, userId },
    });
  } catch {
    throw new ApiError('Failed to fetch todo', 'DB_TODO_FETCH_ERROR', 500);
  }
};

export const createTodo = async (
  prisma: PrismaClient,
  userId: string,
  input: CreateTodoInput,
): Promise<TodoResponse> => {
  try {
    return await prisma.todo.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        deadline: input.deadline ? new Date(input.deadline) : null,
        color: input.color ?? null,
        userId,
      },
    });
  } catch {
    throw new ApiError('Failed to create todo', 'DB_TODO_CREATE_ERROR', 500);
  }
};

export const updateTodo = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
  input: UpdateTodoInput,
): Promise<TodoResponse> => {
  try {
    return await prisma.todo.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.deadline !== undefined && { deadline: input.deadline ? new Date(input.deadline) : null }),
        ...(input.completed !== undefined && { completed: input.completed }),
        ...(input.color !== undefined && { color: input.color }),
      },
    });
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Failed to update todo', 'DB_TODO_UPDATE_ERROR', 500);
  }
};

export const deleteTodoById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<void> => {
  try {
    const result = await prisma.todo.deleteMany({ where: { id, userId } });
    if (result.count === 0) {
      throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Failed to delete todo', 'DB_TODO_DELETE_ERROR', 500);
  }
};
