import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '../validators/auth.schema.js';
import * as auth from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(auth.register));
router.post('/login', validate(loginSchema), asyncHandler(auth.login));
router.post('/refresh', asyncHandler(auth.refresh));
router.post('/logout', asyncHandler(auth.logout));
router.get('/me', protect, asyncHandler(auth.me));
router.patch('/me', protect, validate(updateProfileSchema), asyncHandler(auth.updateMe));

export default router;
