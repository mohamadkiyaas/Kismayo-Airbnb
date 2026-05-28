import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const checkoutSchema = z.object({
  body: z.object({
    bookingId: objectId,
  }),
});
