import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  bookingIdSchema,
  createBookingSchema,
  updateBookingStatusSchema,
} from '../validators/booking.schema.js';
import * as ctrl from '../controllers/booking.controller.js';

const router = Router();

router.use(protect);

router.post('/', validate(createBookingSchema), asyncHandler(ctrl.createBooking));
router.get('/me', asyncHandler(ctrl.myBookings));
router.get('/host', asyncHandler(ctrl.hostBookings));
router.get('/:id', validate(bookingIdSchema), asyncHandler(ctrl.getBooking));
router.patch(
  '/:id/status',
  validate(updateBookingStatusSchema),
  asyncHandler(ctrl.updateBookingStatus)
);

export default router;
