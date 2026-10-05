import mongoose from 'mongoose';
import { z } from 'zod';
import Inquiry from '../models/Inquiry.js';
import Vehicle from '../models/Vehicle.js';

const createSchema = z.strictObject({
  vehicleId: z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid vehicle id').optional(),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(2000),
});

const statusSchema = z.strictObject({ status: z.enum(['new', 'handled']) });

const listQuerySchema = z.object({
  status: z.enum(['new', 'handled']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const badRequest = (res, message, error) =>
  res.status(400).json({
    message,
    errors: error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  });

// Public
export async function createInquiry(req, res, next) {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, 'Invalid inquiry', parsed.error);
    const { vehicleId, ...data } = parsed.data;

    if (vehicleId) {
      const exists = await Vehicle.exists({ _id: vehicleId });
      if (!exists) return res.status(404).json({ message: 'Vehicle not found' });
      data.vehicle = vehicleId;
    }

    await Inquiry.create(data);
    // Don't echo the saved record back to the public
    res.status(201).json({ message: 'Inquiry received. We will be in touch soon.' });
  } catch (err) {
    next(err);
  }
}

// Admin
export async function listInquiries(req, res, next) {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) return badRequest(res, 'Invalid query parameters', parsed.error);
    const { status, page, limit } = parsed.data;

    const filter = status ? { status } : {};

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('vehicle', 'year make model vin')
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    res.json({
      inquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateInquiryStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid inquiry id' });
    }
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, 'Invalid status', parsed.error);

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status: parsed.data.status } },
      { new: true }
    ).lean();

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    next(err);
  }
}