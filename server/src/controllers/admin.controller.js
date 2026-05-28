import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';
import { Review } from '../models/Review.js';
import { ApiError } from '../utils/ApiError.js';
import { destroyFromCloudinary } from '../config/cloudinary.js';

export const listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, data: users.map((u) => u.toPublic()) });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() === id) throw ApiError.badRequest('Cannot delete yourself');
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  await user.deleteOne();
  res.json({ success: true });
};

export const listAllListings = async (_req, res) => {
  const listings = await Listing.find()
    .populate('host', 'name email')
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ success: true, data: listings });
};

export const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw ApiError.notFound('Listing not found');
  for (const img of listing.images || []) {
    if (img.publicId) await destroyFromCloudinary(img.publicId);
  }
  await listing.deleteOne();
  res.json({ success: true });
};

export const getStats = async (_req, res) => {
  const [users, hosts, listings, bookings, reviews, revenueAgg] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'host' }),
    Listing.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
    Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);
  res.json({
    success: true,
    data: {
      users,
      hosts,
      listings,
      bookings,
      reviews,
      revenue: revenueAgg[0]?.total || 0,
    },
  });
};
