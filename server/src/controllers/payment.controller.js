import { getStripe, isStripeConfigured } from '../config/stripe.js';
import { env } from '../config/env.js';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const createCheckoutSession = async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.guest.toString() !== req.user._id.toString())
    throw ApiError.forbidden('Not your booking');
  if (booking.paymentStatus === 'paid')
    throw ApiError.badRequest('Booking is already paid');

  const listing = await Listing.findById(booking.listing);
  if (!listing) throw ApiError.notFound('Listing not found');

  if (!isStripeConfigured()) {
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.stripeSessionId = `mock_${Date.now()}`;
    await booking.save();
    return res.json({
      success: true,
      mocked: true,
      url: `${env.clientUrl}/checkout/success?bookingId=${booking._id}&mock=1`,
    });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: env.stripe.currency,
          unit_amount: Math.round(booking.totalPrice * 100),
          product_data: {
            name: listing.title,
            description: `${booking.nights} night(s) · ${booking.guests} guest(s)`,
            images: listing.images?.[0]?.url ? [listing.images[0].url] : [],
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${env.clientUrl}/checkout/success?bookingId=${booking._id}&session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.clientUrl}/checkout/cancel?bookingId=${booking._id}`,
    metadata: { bookingId: booking._id.toString() },
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({ success: true, url: session.url, sessionId: session.id });
};

export const stripeWebhook = async (req, res) => {
  if (!isStripeConfigured() || !env.stripe.webhookSecret) {
    return res.status(200).json({ received: true, ignored: true });
  }
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
  } catch (err) {
    logger.error(`Stripe webhook signature failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        status: 'confirmed',
        stripeSessionId: session.id,
      });
    }
  } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'failed' });
    }
  }

  res.json({ received: true });
};
