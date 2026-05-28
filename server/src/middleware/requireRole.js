import { ApiError } from '../utils/ApiError.js';

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden(`Requires role: ${roles.join(' or ')}`));
  }
  next();
};
