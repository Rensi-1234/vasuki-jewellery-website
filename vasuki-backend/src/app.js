import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRouter from './routes/health.routes.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';
const app = express();
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VASUKI Jewellery API is running successfully!',
    status: 'OK',
    health: '/api/health',
  });
});

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.frontendOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
}));

app.use('/api/health', healthRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;