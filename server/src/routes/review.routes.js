import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { createReviewSchema } from '../validators/review.schema.js';
import * as ctrl from '../controllers/review.controller.js';

const router = Router();

router.post('/', protect, validate(createReviewSchema), asyncHandler(ctrl.createReview));

export default router;
