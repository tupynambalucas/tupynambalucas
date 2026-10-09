export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(code: string, statusCode = 400) {
    super(code);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}
