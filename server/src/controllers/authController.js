import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(72), // bcrypt ignores anything past 72 bytes
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// Compared against when the email doesn't exist, so response time doesn't reveal it
const DUMMY_HASH = await bcrypt.hash('not-a-real-password', 12);

export async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
    }
    const { name, email, phone, password } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 12);
    // role is never read from the request, so everyone registers as a customer
    const user = await User.create({ name, email, phone, passwordHash });

    res
      .cookie('token', signToken(user), { ...baseCookie, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

    if (!user || !valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res
      .cookie('token', signToken(user), { ...baseCookie, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie('token', baseCookie).json({ message: 'Logged out' });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}