import { PrismaClient } from '../generated/prisma/client.js';
import type { TCreateTodoInput, TUpdateTodoInput } from '../types/todos.types.js';

export const todosCount = async (prisma: PrismaClient, userId: string): Promise<number> => {
  return prisma.todo.count({ where: { userId } });
};

export const todosFindMany = async (
  prisma: PrismaClient,
  userId: string,
  skip: number,
  take: number,
) => {
  return prisma.todo.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

export const todosFindById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
) => {
  return prisma.todo.findFirst({
    where: { id, userId },
  });
};

export const todosCreate = async (
  prisma: PrismaClient,
  userId: string,
  input: TCreateTodoInput,
) => {
  return prisma.todo.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      deadline: input.deadline ? new Date(input.deadline) : null,
      color: input.color ?? null,
      userId,
    },
  });
};

export const todosUpdate = async (
  prisma: PrismaClient,
  id: string,
  input: TUpdateTodoInput,
) => {
  return prisma.todo.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.deadline !== undefined && { deadline: input.deadline ? new Date(input.deadline) : null }),
      ...(input.completed !== undefined && { completed: input.completed }),
      ...(input.color !== undefined && { color: input.color }),
    },
  });
};

export const todosDelete = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<void> => {
  const result = await prisma.todo.deleteMany({ where: { id, userId } });
  if (result.count === 0) {
    const { ApiError } = await import('../utils/errors.js');
    throw new ApiError('Todo not found', 'TODO_NOT_FOUND', 404);
  }
};
