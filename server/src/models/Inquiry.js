import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    // Optional: leave empty for a general "contact us" message
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'handled'], default: 'new' },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);