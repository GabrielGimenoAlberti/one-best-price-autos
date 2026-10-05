import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 17,
      maxlength: 17,
    },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1980 },
    trim: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true, min: 0 },
    bodyType: {
      type: String,
      required: true,
      enum: ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'van', 'convertible', 'wagon'],
    },
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'hybrid', 'electric'],
      default: 'gasoline',
    },
    transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
    drivetrain: { type: String, enum: ['fwd', 'rwd', 'awd', '4wd'] },
    exteriorColor: { type: String, trim: true },
    interiorColor: { type: String, trim: true },
    description: { type: String, trim: true },
    features: [String],
    images: [{ url: String, publicId: String }],
    status: {
      type: String,
      enum: ['available', 'pending', 'sold'],
      default: 'available',
    },
  },
  { timestamps: true }
);

// Indexes for the filters customers use most
vehicleSchema.index({ status: 1, price: 1 });
vehicleSchema.index({ status: 1, bodyType: 1 });
vehicleSchema.index({ status: 1, make: 1, model: 1 });
vehicleSchema.index({ status: 1, year: -1 });

export default mongoose.model('Vehicle', vehicleSchema);