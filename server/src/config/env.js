import dotenv from 'dotenv';
dotenv.config();

const required = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required env var: ${name}`);
    }
    console.warn(`[env] ${name} is not set`);
  }
  return v;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: required('MONGO_URI', 'mongodb://localhost:27017/kismayo-airbnb'),
  jwt: {
    secret: required('JWT_SECRET', 'dev_access_secret_change_me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.STRIPE_CURRENCY || 'usd',
  },
};
