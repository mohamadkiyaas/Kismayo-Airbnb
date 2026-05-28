import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().email('Invalid email').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    role: z.enum(['guest', 'host']).optional().default('guest'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    bio: z.string().max(500).optional(),
    avatar: z
      .object({
        url: z.string().url(),
        publicId: z.string().optional().default(''),
      })
      .optional(),
    role: z.enum(['guest', 'host']).optional(),
  }),
});
