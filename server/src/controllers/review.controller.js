import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

const recomputeListingRating = async (listingId) => {
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id: '$listing', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Listing.findByIdAndUpdate(listingId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
};

export const createReview = async (req, res) => {
  const { booking: bookingId, rating, comment } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.guest.toString() !== req.user._id.toString())
    throw ApiError.forbidden('You can only review your own bookings');
  if (!['confirmed', 'completed'].includes(booking.status))
    throw ApiError.badRequest('You can only review confirmed or completed stays');

  const exists = await Review.findOne({ booking: booking._id });
  if (exists) throw ApiError.conflict('Review already submitted for this booking');

  const review = await Review.create({
    listing: booking.listing,
    booking: booking._id,
    author: req.user._id,
    rating,
    comment,
  });
  await recomputeListingRating(booking.listing);
  res.status(201).json({ success: true, data: review });
};

export const listListingReviews = async (req, res) => {
  const reviews = await Review.find({ listing: req.params.id })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};
