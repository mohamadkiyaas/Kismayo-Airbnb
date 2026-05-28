import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw ApiError.unauthorized('Authentication required');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw ApiError.unauthorized('User no longer exists');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
    next();
  } catch (_err) {
    next();
  }
};
