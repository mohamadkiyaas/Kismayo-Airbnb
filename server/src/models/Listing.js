import mongoose from 'mongoose';

export const LISTING_CATEGORIES = [
  'beachfront',
  'city',
  'countryside',
  'desert',
  'lake',
  'luxury',
  'mansions',
  'tropical',
  'cabins',
  'islands',
  'amazing-views',
  'rooms',
];

export const LISTING_TYPES = ['apartment', 'house', 'villa', 'room', 'cabin', 'hotel'];

export const AMENITIES = [
  'wifi',
  'kitchen',
  'parking',
  'pool',
  'ac',
  'heating',
  'tv',
  'washer',
  'dryer',
  'workspace',
  'gym',
  'beach-access',
  'breakfast',
  'pet-friendly',
];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 4000 },
    type: { type: String, enum: LISTING_TYPES, default: 'apartment', index: true },
    category: { type: String, enum: LISTING_CATEGORIES, default: 'city', index: true },
    location: {
      country: { type: String, required: true, index: true },
      city: { type: String, required: true, index: true },
      address: { type: String, default: '' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
      },
    },
    pricePerNight: { type: Number, required: true, min: 0, index: true },
    currency: { type: String, default: 'USD' },
    bedrooms: { type: Number, default: 1, min: 0 },
    beds: { type: Number, default: 1, min: 0 },
    baths: { type: Number, default: 1, min: 0 },
    maxGuests: { type: Number, default: 2, min: 1, index: true },
    amenities: [{ type: String, enum: AMENITIES }],
    images: { type: [imageSchema], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

export const Listing = mongoose.model('Listing', listingSchema);
