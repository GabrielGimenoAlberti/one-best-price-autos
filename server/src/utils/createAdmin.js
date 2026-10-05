import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in server/.env first');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { name: ADMIN_NAME || 'Admin', passwordHash, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin ready: ${ADMIN_EMAIL}`);
} catch (err) {
  console.error('Failed:', err.message);
} finally {
  await mongoose.disconnect();
}