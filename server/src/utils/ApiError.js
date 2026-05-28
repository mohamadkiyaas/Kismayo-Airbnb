export class ApiError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(msg = 'Bad request', opts) {
    return new ApiError(400, msg, opts);
  }
  static unauthorized(msg = 'Unauthorized', opts) {
    return new ApiError(401, msg, opts);
  }
  static forbidden(msg = 'Forbidden', opts) {
    return new ApiError(403, msg, opts);
  }
  static notFound(msg = 'Resource not found', opts) {
    return new ApiError(404, msg, opts);
  }
  static conflict(msg = 'Conflict', opts) {
    return new ApiError(409, msg, opts);
  }
  static internal(msg = 'Internal server error', opts) {
    return new ApiError(500, msg, opts);
  }
}
