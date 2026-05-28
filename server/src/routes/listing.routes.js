import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  createListingSchema,
  listListingsSchema,
  listingIdSchema,
  updateListingSchema,
} from '../validators/listing.schema.js';
import { listingAvailabilitySchema } from '../validators/booking.schema.js';
import * as ctrl from '../controllers/listing.controller.js';
import * as reviewCtrl from '../controllers/review.controller.js';

const router = Router();

router.get('/', validate(listListingsSchema), optionalAuth, asyncHandler(ctrl.listListings));
router.get('/mine', protect, asyncHandler(ctrl.myListings));
router.post(
  '/',
  protect,
  validate(createListingSchema),
  asyncHandler(ctrl.createListing)
);
router.get('/:id', validate(listingIdSchema), asyncHandler(ctrl.getListing));
router.patch(
  '/:id',
  protect,
  validate(updateListingSchema),
  asyncHandler(ctrl.updateListing)
);
router.delete(
  '/:id',
  protect,
  validate(listingIdSchema),
  asyncHandler(ctrl.deleteListing)
);
router.get(
  '/:id/availability',
  validate(listingAvailabilitySchema),
  asyncHandler(ctrl.getAvailability)
);
router.get(
  '/:id/reviews',
  validate(listingIdSchema),
  asyncHandler(reviewCtrl.listListingReviews)
);

export default router;
