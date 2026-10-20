import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  return res.status(isDatabaseConnected ? 200 : 503).json({
    success: isDatabaseConnected,
    status: isDatabaseConnected ? 'ok' : 'unavailable',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;