import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Blocks the request unless a valid login cookie is present
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not logged in' });
  }
}

// Use after requireAuth on admin-only routes
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}