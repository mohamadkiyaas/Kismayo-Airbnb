import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { checkoutSchema } from '../validators/payment.schema.js';
import * as ctrl from '../controllers/payment.controller.js';

const router = Router();

router.post(
  '/checkout',
  protect,
  validate(checkoutSchema),
  asyncHandler(ctrl.createCheckoutSession)
);

export default router;
