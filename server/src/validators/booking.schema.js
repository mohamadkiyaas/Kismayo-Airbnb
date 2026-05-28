import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createBookingSchema = z.object({
  body: z
    .object({
      listing: objectId,
      checkIn: z.coerce.date(),
      checkOut: z.coerce.date(),
      guests: z.coerce.number().int().min(1),
    })
    .refine((d) => d.checkOut > d.checkIn, {
      message: 'checkOut must be after checkIn',
      path: ['checkOut'],
    })
    .refine((d) => d.checkIn >= new Date(new Date().toDateString()), {
      message: 'checkIn cannot be in the past',
      path: ['checkIn'],
    }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(['confirmed', 'cancelled', 'completed']),
    cancellationReason: z.string().max(500).optional(),
  }),
});

export const bookingIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listingAvailabilitySchema = z.object({
  params: z.object({ id: objectId }),
  query: z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
});
