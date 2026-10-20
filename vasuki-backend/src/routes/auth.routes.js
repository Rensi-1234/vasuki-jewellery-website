import express from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Login with email and password
router.post('/login', login);

// Get the currently authenticated user's details
router.get('/me', protect, getMe);

export default router;