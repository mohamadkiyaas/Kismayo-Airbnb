import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} from '../utils/jwt.js';

const buildAuthResponse = (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: user.toPublic(),
  };
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('Email already registered');
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });
  const { accessToken, refreshToken, user: pub } = buildAuthResponse(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.status(201).json({ success: true, accessToken, user: pub });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');
  const { accessToken, refreshToken, user: pub } = buildAuthResponse(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.json({ success: true, accessToken, user: pub });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('Missing refresh token');
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  const { accessToken, refreshToken: newRefresh, user: pub } = buildAuthResponse(user);
  res.cookie('refreshToken', newRefresh, refreshCookieOptions);
  res.json({ success: true, accessToken, user: pub });
};

export const logout = async (_req, res) => {
  res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: 0 });
  res.json({ success: true });
};

export const me = async (req, res) => {
  res.json({ success: true, user: req.user.toPublic() });
};

export const updateMe = async (req, res) => {
  const allowed = ['name', 'bio', 'avatar', 'role'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ success: true, user: req.user.toPublic() });
};
