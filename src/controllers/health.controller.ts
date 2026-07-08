import { Request, Response } from 'express';

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
