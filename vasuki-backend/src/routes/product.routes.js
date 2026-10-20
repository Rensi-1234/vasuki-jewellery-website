import express from 'express';

import {
  getProducts,
  getProductBySlug,
  uploadProductImage,
  uploadProductImageMiddleware,
  createProduct,
} from '../controllers/product.controller.js';

import {
  protect,
  adminOnly,
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProducts);

router.post(
  '/',
  protect,
  adminOnly,
  uploadProductImageMiddleware,
  createProduct
);

router.post(
  '/:id/image',
  protect,
  adminOnly,
  uploadProductImageMiddleware,
  uploadProductImage
);

router.get('/:slug', getProductBySlug);

export default router;