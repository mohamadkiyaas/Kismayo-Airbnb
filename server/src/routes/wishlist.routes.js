import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import * as ctrl from '../controllers/wishlist.controller.js';

const router = Router();

const listingIdParam = z.object({
  params: z.object({ listingId: z.string().regex(/^[a-f\d]{24}$/i) }),
});

router.use(protect);
router.get('/', asyncHandler(ctrl.listWishlist));
router.post('/:listingId', validate(listingIdParam), asyncHandler(ctrl.addToWishlist));
router.delete('/:listingId', validate(listingIdParam), asyncHandler(ctrl.removeFromWishlist));

export default router;
