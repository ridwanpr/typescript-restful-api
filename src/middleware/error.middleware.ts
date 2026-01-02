import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../error/response.error';

export const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: {
        type: 'Validation Error',
        details: error.issues.map((issue) => {
          if (issue.path.length === 0 && issue.code === 'invalid_type') {
            return {
              field: 'body',
              message: 'Request body is required',
            };
          }

          return {
            field: issue.path.join('.') || 'unknown',
            message: issue.message,
          };
        }),
      },
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: {
        type: 'Application Error',
        message: error.message,
      },
    });
  } else {
    res.status(500).json({
      errors: {
        type: 'Internal Server Error',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  }
};
