import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let code = err.code;
  let errors;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    errors = err.flatten().fieldErrors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'MONGOOSE_VALIDATION_ERROR';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, [v.message]])
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate ${field}`;
    code = 'DUPLICATE_KEY';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
    if (err.stack) logger.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(code ? { code } : {}),
    ...(errors ? { errors } : {}),
    ...(env.nodeEnv !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
};
