import { Request, Response } from 'express';

/**
 * Health check endpoint.
 * Returns server status, timestamp, and environment info.
 */
export const getHealth = () => {
  return (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  };
};
