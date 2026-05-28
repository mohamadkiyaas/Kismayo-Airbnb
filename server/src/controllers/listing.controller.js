import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';

const buildFilter = (q) => {
  const filter = { status: q.status || 'active' };
  if (q.host) filter.host = q.host;
  if (q.q) filter.$text = { $search: q.q };
  if (q.city) filter['location.city'] = new RegExp(`^${q.city}$`, 'i');
  if (q.country) filter['location.country'] = new RegExp(`^${q.country}$`, 'i');
  if (q.category) filter.category = q.category;
  if (q.type) filter.type = q.type;
  if (q.guests) filter.maxGuests = { $gte: q.guests };
  if (q.bedrooms) filter.bedrooms = { $gte: q.bedrooms };
  if (q.beds) filter.beds = { $gte: q.beds };
  if (q.baths) filter.baths = { $gte: q.baths };
  if (q.minPrice || q.maxPrice) {
    filter.pricePerNight = {};
    if (q.minPrice) filter.pricePerNight.$gte = q.minPrice;
    if (q.maxPrice) filter.pricePerNight.$lte = q.maxPrice;
  }
  if (q.amenities && q.amenities.length) filter.amenities = { $all: q.amenities };
  if (q.bbox) {
    const [minLng, minLat, maxLng, maxLat] = q.bbox.split(',').map(Number);
    if (![minLng, minLat, maxLng, maxLat].some((n) => Number.isNaN(n))) {
      filter['location.coordinates'] = {
        $geoWithin: {
          $box: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
        },
      };
    }
  }
  return filter;
};

const sortMap = {
  newest: { createdAt: -1 },
  price_asc: { pricePerNight: 1 },
  price_desc: { pricePerNight: -1 },
  rating: { rating: -1 },
};

export const listListings = async (req, res) => {
  const q = req.query;
  const filter = buildFilter(q);

  let unavailableIds = [];
  if (q.checkIn && q.checkOut) {
    const overlapping = await Booking.find({
      checkIn: { $lt: q.checkOut },
      checkOut: { $gt: q.checkIn },
      status: { $in: ['pending', 'confirmed'] },
    }).distinct('listing');
    unavailableIds = overlapping;
  }
  if (unavailableIds.length) filter._id = { $nin: unavailableIds };

  const page = q.page || 1;
  const limit = q.limit || 24;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .populate('host', 'name avatar')
      .sort(sortMap[q.sort] || sortMap.newest)
      .skip(skip)
      .limit(limit),
    Listing.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('host', 'name avatar bio createdAt');
  if (!listing) throw ApiError.notFound('Listing not found');
  res.json({ success: true, data: listing });
};

export const createListing = async (req, res) => {
  const data = { ...req.body, host: req.user._id };
  if (req.user.role === 'guest') {
    req.user.role = 'host';
    await req.user.save();
  }
  const listing = await Listing.create(data);
  res.status(201).json({ success: true, data: listing });
};

export const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw ApiError.notFound('Listing not found');
  const isOwner = listing.host.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw ApiError.forbidden();
  Object.assign(listing, req.body);
  await listing.save();
  res.json({ success: true, data: listing });
};

export const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw ApiError.notFound('Listing not found');
  const isOwner = listing.host.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw ApiError.forbidden();
  await listing.deleteOne();
  res.json({ success: true });
};

export const myListings = async (req, res) => {
  const items = await Listing.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

export const getAvailability = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw ApiError.notFound('Listing not found');
  const from = req.query.from ? new Date(req.query.from) : new Date();
  const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  const bookings = await Booking.find({
    listing: listing._id,
    status: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: to },
    checkOut: { $gt: from },
  }).select('checkIn checkOut');
  res.json({ success: true, data: bookings });
};
