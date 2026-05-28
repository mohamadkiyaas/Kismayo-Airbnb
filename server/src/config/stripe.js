import Stripe from 'stripe';
import { env } from './env.js';

let stripeClient = null;

export const getStripe = () => {
  if (!env.stripe.secretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripe.secretKey, { apiVersion: '2024-09-30.acacia' });
  }
  return stripeClient;
};

export const isStripeConfigured = () => Boolean(env.stripe.secretKey);
