export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export function mapDbError(error: any): AppError {
  // PostgreSQL
  if (error.code === '23505') {
    return new ConflictError('Duplicate entry');
  }
  if (error.code === '23503') {
    return new ValidationError('Invalid reference');
  }

  // Unknown
  return new AppError('Database error', 500);
}

export function formatError(error: unknown) {
  if (error instanceof AppError) {
    const response: any = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };

    if (error.details) {
      response.error.details = error.details;
    }

    if (process.env.NODE_ENV === 'development' && error.stack) {
      response.error.stack = error.stack;
    }

    return response;
  }

  return {
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'development'
          ? String(error)
          : 'Internal server error',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  };
}
