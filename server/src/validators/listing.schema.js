import { z } from 'zod';
import { AMENITIES, LISTING_CATEGORIES, LISTING_TYPES } from '../models/Listing.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional().default(''),
});

const baseListing = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(4000),
  type: z.enum(LISTING_TYPES).default('apartment'),
  category: z.enum(LISTING_CATEGORIES).default('city'),
  location: z.object({
    country: z.string().trim().min(2),
    city: z.string().trim().min(1),
    address: z.string().trim().optional().default(''),
    coordinates: z.object({
      type: z.literal('Point').optional().default('Point'),
      coordinates: z
        .tuple([
          z.number().min(-180).max(180),
          z.number().min(-90).max(90),
        ])
        .describe('[longitude, latitude]'),
    }),
  }),
  pricePerNight: z.coerce.number().min(1).max(100000),
  currency: z.string().length(3).optional().default('USD'),
  bedrooms: z.coerce.number().int().min(0).max(50).default(1),
  beds: z.coerce.number().int().min(0).max(50).default(1),
  baths: z.coerce.number().min(0).max(50).default(1),
  maxGuests: z.coerce.number().int().min(1).max(50).default(2),
  amenities: z.array(z.enum(AMENITIES)).default([]),
  images: z.array(imageSchema).min(1, 'At least one image is required').max(20),
  status: z.enum(['active', 'inactive', 'draft']).optional().default('active'),
});

export const createListingSchema = z.object({
  body: baseListing,
});

export const updateListingSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseListing.partial(),
});

export const listingIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listListingsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    category: z.enum(LISTING_CATEGORIES).optional(),
    type: z.enum(LISTING_TYPES).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    guests: z.coerce.number().int().min(1).optional(),
    bedrooms: z.coerce.number().int().min(0).optional(),
    beds: z.coerce.number().int().min(0).optional(),
    baths: z.coerce.number().min(0).optional(),
    amenities: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (Array.isArray(v) ? v : v ? v.split(',') : undefined)),
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    bbox: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).optional().default('newest'),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(60).optional().default(24),
    host: objectId.optional(),
    status: z.enum(['active', 'inactive', 'draft']).optional(),
  }),
});
