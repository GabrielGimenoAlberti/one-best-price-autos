import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Vehicle from '../models/Vehicle.js';

const MAX_IMAGES_PER_VEHICLE = 30;

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'webp'],
        // Shrinks anything larger than 1600x1200 before storing, saving space
        transformation: [{ width: 1600, height: 1200, crop: 'limit' }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function addImages(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid vehicle id' });
    }
    if (!req.files?.length) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (vehicle.images.length + req.files.length > MAX_IMAGES_PER_VEHICLE) {
      return res
        .status(400)
        .json({ message: `A vehicle can have at most ${MAX_IMAGES_PER_VEHICLE} images` });
    }

    const results = await Promise.all(
      req.files.map((file) => uploadBuffer(file.buffer, `onebestpriceautos/vehicles/${id}`))
    );

    vehicle.images.push(...results.map((r) => ({ url: r.secure_url, publicId: r.public_id })));
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function removeImage(req, res, next) {
  try {
    const { id, imageId } = req.params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(imageId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const image = vehicle.images.id(imageId);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await cloudinary.uploader.destroy(image.publicId);
    vehicle.images.pull(imageId);
    await vehicle.save();

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}