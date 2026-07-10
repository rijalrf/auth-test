import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
  color: z.string().max(7, 'Color too long').optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
  completed: z.boolean().optional(),
  color: z.string().max(7, 'Color too long').optional(),
});
