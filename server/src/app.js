import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { stripeWebhook } from './controllers/payment.controller.js';

import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reviewRoutes from './routes/review.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.set('trust proxy', 1);

// Stripe webhook needs the raw body — register BEFORE json parser
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000'];
      if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)) {
        return cb(null, true);
      }
      cb(null, true); // permissive in dev; tighten in prod via CLIENT_URL
    },
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.get('/api/health', (_req, res) =>
  res.json({ success: true, status: 'ok', env: env.nodeEnv, time: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
