import 'dotenv/config';
import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

const vehicles = [
  { vin: 'SEEDCAR0000000001', make: 'Honda', model: 'Civic', year: 2020, trim: 'EX', price: 18500, mileage: 42000, bodyType: 'sedan', fuelType: 'gasoline', drivetrain: 'fwd', exteriorColor: 'Blue', features: ['Backup camera', 'Apple CarPlay'] },
  { vin: 'SEEDCAR0000000002', make: 'Toyota', model: 'RAV4', year: 2021, trim: 'XLE', price: 27900, mileage: 31000, bodyType: 'suv', fuelType: 'gasoline', drivetrain: 'awd', exteriorColor: 'White', features: ['Sunroof', 'Blind spot monitor'] },
  { vin: 'SEEDCAR0000000003', make: 'Ford', model: 'F-150', year: 2019, trim: 'XLT', price: 31500, mileage: 58000, bodyType: 'truck', fuelType: 'gasoline', drivetrain: '4wd', exteriorColor: 'Black' },
  { vin: 'SEEDCAR0000000004', make: 'Tesla', model: 'Model 3', year: 2022, trim: 'Long Range', price: 33900, mileage: 18000, bodyType: 'sedan', fuelType: 'electric', drivetrain: 'awd', exteriorColor: 'Red' },
  { vin: 'SEEDCAR0000000005', make: 'Mazda', model: 'CX-5', year: 2018, trim: 'Touring', price: 19900, mileage: 67000, bodyType: 'suv', fuelType: 'gasoline', drivetrain: 'awd', exteriorColor: 'Gray' },
  { vin: 'SEEDCAR0000000006', make: 'Chevrolet', model: 'Malibu', year: 2017, trim: 'LT', price: 12400, mileage: 82000, bodyType: 'sedan', fuelType: 'gasoline', drivetrain: 'fwd', exteriorColor: 'Silver', status: 'sold' },
];

try {
  await mongoose.connect(process.env.MONGO_URI);
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
  console.log(`Seeded ${vehicles.length} vehicles`);
} catch (err) {
  console.error('Seed failed:', err.message);
} finally {
  await mongoose.disconnect();
}