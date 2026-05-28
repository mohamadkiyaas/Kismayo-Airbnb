import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['guest', 'host']).default('guest'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  bio: z.string().max(500).optional().or(z.literal('')),
});

export const listingFormSchema = z.object({
  title: z.string().min(3, 'Title is too short').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters').max(4000),
  type: z.string(),
  category: z.string(),
  country: z.string().min(2),
  city: z.string().min(1),
  address: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  pricePerNight: z.coerce.number().min(1, 'Price must be at least 1'),
  bedrooms: z.coerce.number().int().min(0),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().min(0),
  maxGuests: z.coerce.number().int().min(1),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string().optional() })).min(1, 'Add at least one image'),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3, 'Please write a short comment').max(2000),
});
