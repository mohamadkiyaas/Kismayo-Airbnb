import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.secret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
