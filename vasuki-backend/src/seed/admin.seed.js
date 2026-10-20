import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const createAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } =
      process.env;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required.');
    }

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.'
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
    }

    await mongoose.connect(MONGODB_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role !== 'admin') {
        throw new Error(
          'This email already belongs to a customer. Choose a different admin email.'
        );
      }

      console.log('An administrator with this email already exists.');
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME.trim(),
      email,
      password: passwordHash,
      role: 'admin',
      isActive: true,
      emailVerified: true,
    });

    console.log('Administrator account created successfully.');
    console.log(`Admin email: ${email}`);
    console.log('Password: the value configured in your private .env file');
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();