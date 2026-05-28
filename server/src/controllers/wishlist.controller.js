import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

export const listWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    populate: { path: 'host', select: 'name avatar' },
  });
  res.json({ success: true, data: user.favorites });
};

export const addToWishlist = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: listing._id } });
  res.json({ success: true });
};

export const removeFromWishlist = async (req, res) => {
  const { listingId } = req.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: listingId } });
  res.json({ success: true });
};
