import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

const SERVICE_FEE_RATE = 0.12;

const computeNights = (checkIn, checkOut) =>
  Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

const isOverlap = async (listingId, checkIn, checkOut, ignoreId) => {
  const conflict = await Booking.findOne({
    listing: listingId,
    _id: { $ne: ignoreId },
    status: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
  return Boolean(conflict);
};

export const createBooking = async (req, res) => {
  const { listing: listingId, checkIn, checkOut, guests } = req.body;
  const listing = await Listing.findById(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');
  if (listing.status !== 'active') throw ApiError.badRequest('Listing is not available');
  if (listing.host.toString() === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot book your own listing');
  }
  if (guests > listing.maxGuests) {
    throw ApiError.badRequest(`Max ${listing.maxGuests} guests allowed`);
  }
  const overlaps = await isOverlap(listingId, checkIn, checkOut);
  if (overlaps) throw ApiError.conflict('Selected dates are not available');

  const nights = computeNights(checkIn, checkOut);
  const subtotal = nights * listing.pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const totalPrice = subtotal + serviceFee;

  const booking = await Booking.create({
    listing: listing._id,
    guest: req.user._id,
    host: listing.host,
    checkIn,
    checkOut,
    nights,
    guests,
    pricePerNight: listing.pricePerNight,
    serviceFee,
    totalPrice,
    currency: listing.currency,
  });

  res.status(201).json({ success: true, data: booking });
};

export const myBookings = async (req, res) => {
  const items = await Booking.find({ guest: req.user._id })
    .populate('listing', 'title images location pricePerNight currency')
    .populate('host', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

export const hostBookings = async (req, res) => {
  const items = await Booking.find({ host: req.user._id })
    .populate('listing', 'title images location')
    .populate('guest', 'name avatar email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

export const getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('listing')
    .populate('host', 'name avatar email')
    .populate('guest', 'name avatar email');
  if (!booking) throw ApiError.notFound('Booking not found');
  const isParty =
    booking.guest._id.toString() === req.user._id.toString() ||
    booking.host._id.toString() === req.user._id.toString();
  if (!isParty && req.user.role !== 'admin') throw ApiError.forbidden();
  res.json({ success: true, data: booking });
};

export const updateBookingStatus = async (req, res) => {
  const { status, cancellationReason } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw ApiError.notFound('Booking not found');

  const isHost = booking.host.toString() === req.user._id.toString();
  const isGuest = booking.guest.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (status === 'confirmed') {
    if (!isHost && !isAdmin) throw ApiError.forbidden('Only host can confirm');
    if (booking.status !== 'pending') throw ApiError.badRequest('Only pending bookings can be confirmed');
    booking.status = 'confirmed';
  } else if (status === 'cancelled') {
    if (!isHost && !isGuest && !isAdmin) throw ApiError.forbidden();
    if (['cancelled', 'completed'].includes(booking.status))
      throw ApiError.badRequest('Booking cannot be cancelled');
    booking.status = 'cancelled';
    if (cancellationReason) booking.cancellationReason = cancellationReason;
  } else if (status === 'completed') {
    if (!isHost && !isAdmin) throw ApiError.forbidden();
    if (booking.status !== 'confirmed')
      throw ApiError.badRequest('Only confirmed bookings can be completed');
    booking.status = 'completed';
  }

  await booking.save();
  res.json({ success: true, data: booking });
};
