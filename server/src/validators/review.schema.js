import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createReviewSchema = z.object({
  body: z.object({
    booking: objectId,
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(3).max(2000),
  }),
});

export const listingReviewsSchema = z.object({
  params: z.object({ id: objectId }),
});
