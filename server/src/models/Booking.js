import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true },
    serviceFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded', 'failed'],
      default: 'unpaid',
      index: true,
    },
    stripeSessionId: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
