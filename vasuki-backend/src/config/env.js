import 'dotenv/config';

const port = Number(process.env.PORT || 5000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is required. Copy .env.example to .env and configure it.'
  );
}

const frontendOrigins = (
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    'JWT_SECRET is required and must contain at least 32 characters.'
  );
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  frontendOrigins,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});