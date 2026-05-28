import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:');
  logger.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:');
  logger.error(reason);
});
