import express from 'express';

import {
  getCategories,
  getCategoryBySlug,
} from '../controllers/category.controller.js';

const router = express.Router();

// Get all active categories
router.get('/', getCategories);

// Get one category by its slug
router.get('/:slug', getCategoryBySlug);

export default router;