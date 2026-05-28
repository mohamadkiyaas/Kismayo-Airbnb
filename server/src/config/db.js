import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production',
    });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
