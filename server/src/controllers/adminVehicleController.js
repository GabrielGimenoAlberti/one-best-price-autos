import mongoose from 'mongoose';
import { z } from 'zod';
import Vehicle from '../models/Vehicle.js';

// Keep these lists in sync with the enums in models/Vehicle.js
const BODY_TYPES = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'van', 'convertible', 'wagon'];
const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric'];
const TRANSMISSIONS = ['automatic', 'manual'];
const DRIVETRAINS = ['fwd', 'rwd', 'awd', '4wd'];
const STATUSES = ['available', 'pending', 'sold'];

// strictObject rejects any field not listed here, so nobody can slip in extra data
const vehicleSchema = z.strictObject({
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN must be 17 characters (letters I, O, Q are not allowed)'),
  make: z.string().trim().min(1).max(50),
  model: z.string().trim().min(1).max(50),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  trim: z.string().trim().max(50).optional(),
  price: z.number().min(0),
  mileage: z.number().min(0),
  bodyType: z.enum(BODY_TYPES),
  fuelType: z.enum(FUEL_TYPES).optional(),
  transmission: z.enum(TRANSMISSIONS).optional(),
  drivetrain: z.enum(DRIVETRAINS).optional(),
  exteriorColor: z.string().trim().max(50).optional(),
  interiorColor: z.string().trim().max(50).optional(),
  description: z.string().trim().max(5000).optional(),
  features: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  status: z.enum(STATUSES).optional(),
});

// For edits, every field becomes optional so you can send only what changed
const updateSchema = vehicleSchema.partial();

const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const badRequest = (res, message, error) =>
  res.status(400).json({
    message,
    errors: error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  });

export async function listVehicles(req, res, next) {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) return badRequest(res, 'Invalid query parameters', parsed.error);
    const { status, page, limit } = parsed.data;

    const filter = status ? { status } : {};

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter)
        .sort({ createdAt: -1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(filter),
    ]);

    res.json({
      vehicles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getVehicle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid vehicle id' });
    }
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const parsed = vehicleSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, 'Invalid vehicle data', parsed.error);

    const vehicle = await Vehicle.create(parsed.data);
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A vehicle with that VIN already exists' });
    }
    next(err);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid vehicle id' });
    }

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, 'Invalid vehicle data', parsed.error);
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A vehicle with that VIN already exists' });
    }
    next(err);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid vehicle id' });
    }
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id).lean();
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    next(err);
  }
}