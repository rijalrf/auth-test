import { Response } from 'express';

export interface ApiResponse<T = unknown, M = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: M;
  code?: string;
}

export function sendSuccess<T, M = unknown>(res: Response, message: string, data: T, status = 200, meta?: M): void {
  const body: ApiResponse<T, M> = { success: true, message, data };
  if (meta !== undefined) body.meta = meta;
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, code?: string, status = 400): void {
  const body: ApiResponse = { success: false, message };
  if (code) body.code = code;
  res.status(status).json(body);
}
