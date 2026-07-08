import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export function sendSuccess<T>(res: Response, message: string, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, code?: string, status = 400): void {
  const body: ApiResponse = { success: false, message };
  if (code) body.code = code;
  res.status(status).json(body);
}
