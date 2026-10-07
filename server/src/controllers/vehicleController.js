import mongoose from 'mongoose';
import { z } from 'zod';
import Vehicle from '../models/Vehicle.js';

// Validates and converts the query string (?bodyType=suv&maxPrice=30000)
const querySchema = z.object({
  make: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  bodyType: z.string().trim().min(1).optional(),
  fuelType: z.string().trim().min(1).optional(),
  transmission: z.string().trim().min(1).optional(),
  drivetrain: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
  maxMileage: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'year_desc', 'mileage_asc']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const sortOptions = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  year_desc: { year: -1 },
  mileage_asc: { mileage: 1 },
};

// Case-insensitive exact match, with special characters escaped
const exactMatch = (value) =>
  new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

export async function getVehicles(req, res, next) {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
    }
    const q = parsed.data;

    // Public list only ever shows available cars
    const filter = { status: 'available' };

    if (q.make) filter.make = exactMatch(q.make);
    if (q.model) filter.model = exactMatch(q.model);
    if (q.bodyType) filter.bodyType = q.bodyType.toLowerCase();
    if (q.fuelType) filter.fuelType = q.fuelType.toLowerCase();
    if (q.transmission) filter.transmission = q.transmission.toLowerCase();
    if (q.drivetrain) filter.drivetrain = q.drivetrain.toLowerCase();

    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      filter.price = {};
      if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
      if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
    }
    if (q.minYear !== undefined || q.maxYear !== undefined) {
      filter.year = {};
      if (q.minYear !== undefined) filter.year.$gte = q.minYear;
      if (q.maxYear !== undefined) filter.year.$lte = q.maxYear;
    }
    if (q.maxMileage !== undefined) filter.mileage = { $lte: q.maxMileage };

    const skip = (q.page - 1) * q.limit;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter)
        .sort({ ...sortOptions[q.sort], _id: 1 }) // _id keeps page order stable
        .skip(skip)
        .limit(q.limit)
        .lean(),
      Vehicle.countDocuments(filter),
    ]);

    res.json({
      vehicles,
      pagination: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid vehicle id' });
    }

    const vehicle = await Vehicle.findOne({ _id: id, status: 'available' }).lean();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}